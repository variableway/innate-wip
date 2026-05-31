# How to Administer and Maintain a Docker Swarm Cluster

After deploying a [High Availability Docker Swarm setup](https://betterstack.com/community/guides/scaling-docker/ha-docker-swarm/), there
is often a need to re-design the underlying physical infrastructure which is
hosting the deployed services. This need might be prompted by multiple factors,
such as the following:

- Your service is in high demand, and you need to add more compute resources to
  cope with it.
- A node has been compromised, and you want to quarantine it.
- Your nodes are inactive, and you want to save energy and money by making the
  cluster smaller.
- You are running multiple services with uncorrelated constraints, and you need
  to add additional heterogeneous nodes to cope with said constraints.

In this tutorial, you will learn how to administer a Docker Swarm cluster by
adding nodes, gracefully removing them, or changing a node's role within the
cluster. For future reference, when the terms "scaling in" and "scaling out" are
mentioned in the tutorial, we mean:

- **Scaling in**: removing nodes from the existing cluster.
- **Scaling out**: adding more nodes to the existing cluster.

We'll start the tutorial by analyzing the current state of the cluster (from
where we left it at the end of the [previous
tutorial](https://betterstack.com/community/guides/scaling-docker/horizontally-scaling-swarm/)) and its services, then we can fix any
pending service tasks by scaling out the cluster horizontally. We'll later
promote one of the workers to a manager just before draining an existing node
and making it leave the cluster (scaling in).

We will primarily use the Docker CLI and its `docker node` and `docker swarm`
commands to handle all the cluster-level operations and inspections. These
commands will allow us to:

- List and inspect the cluster and its nodes.
- Join new nodes for scaling out the cluster.
- Promote workers to managers, thus scaling out just the set of manager nodes.
- Update existing nodes, such that they gracefully cease the execution of tasks.
- Leave a Swarm cluster such that inactive nodes can be removed gracefully
  (scaling in).

## Prerequisites

This tutorial is a follow-up to the previous one that discusses [how to
horizontally scale a Docker Swarm Cluster in
production](https://betterstack.com/community/guides/scaling-docker/horizontally-scaling-swarm/), so ensure you've read and performed all
of its steps. You also need to set up two additional servers called `worker-3`
and `worker-4`, and execute the commands provided in Steps 1 and 2 of [our High
Availability Docker Swarm tutorial](https://betterstack.com/community/guides/scaling-docker/ha-docker-swarm/) on each server to ensure
that both servers are ready to join a Swarm cluster as worker nodes. Afterward,
make sure you are connected to the cluster's Leader node.


[ad-logs-small]

## Step 1 — Verifying the state of the cluster

At this stage, you should find yourself at the end of the previous tutorial,
meaning that you should be logged into the Leader node and see a five-node
Docker Swarm cluster (with three managers and two workers), where all the
manager nodes have have been drained:

```command
docker node ls
```

```text
[output]
ID                            HOSTNAME    STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
9r83zto8qpqiazt6slxfkjypq     manager-1   Ready     Drain          Reachable        20.10.18
uspt9qwqnzqwl78gbxc7omja7     manager-2   Ready     Drain          Reachable        20.10.18
txrdxwuwjpg5jjfer3bcmtc5r *   manager-3   Ready     Drain          Leader           20.10.18
kaq8r9gec4t58yc9oh3dc0r2d     worker-1    Ready     Active                          20.10.18
vk1224zd81xcihgm1iis2703z     worker-2    Ready     Active                          20.10.18
```

You should also confirm that there is a Docker stack deployed in your cluster
named `nginx`:

```command
docker stack ls
```

```text
[output]
NAME      SERVICES   ORCHESTRATOR
nginx     1          Swarm
```

In the `nginx` stack, there should be a single service called `nginx_nginx` with
five replicas:

```command
docker service ps nginx_nginx
```

```text
[output]
ID             NAME            IMAGE          NODE       DESIRED STATE   CURRENT STATE                ERROR                              PORTS
ikq7t6neux8n   nginx_nginx.1   nginx:latest   worker-1   Running         Running about a minute ago
gxanzkz032ih   nginx_nginx.2   nginx:latest   worker-2   Running         Running about a minute ago
5kl334ckqook   nginx_nginx.3   nginx:latest   worker-1   Running         Running about a minute ago
zj7voybfjvz1   nginx_nginx.4   nginx:latest   worker-2   Running         Running about a minute ago
[highlight]
uq7cnb2jup1v   nginx_nginx.5   nginx:latest              Running         Pending 52 seconds ago       "no suitable node (3 nodes not…"
[/highlight]
```

Note that the fifth replica highlighted above (`nginx_nginx.5`) is "Pending"
because in the final step of the previous tutorial, we set some service
constraints that prevents a node from running more than two replicas at once.
Therefore, since `worker-1` and `worker-2` are already at their limits, the
fifth replica has no where to go so it remains in a "Pending" state.

For a closer look, we can inspect this replica through the following command:

```command
docker inspect <pending_replica_id>
```

```text
[
    {
        "ID": "uq7cnb2jup1vzmna8ormeaegi",
        . . .
        [highlight]
        "Spec": {
            . . .
            "Placement": {
                "MaxReplicas": 2,
                . . .
            },
            . . .
        },
        "ServiceID": "ayyax6sx0dyb73hpxyq25tc42",
        "Slot": 5,
        "Status": {
            "Timestamp": "2022-10-11T12:08:43.874973849Z",
            "State": "pending",
            "Message": "pending task scheduling",
            "Err": "no suitable node (3 nodes not available for new tasks; max replicas per node limit exceed)",
            "PortStatus": {}
        },
        [/highlight]
        "DesiredState": "running",
        . . .
    }
]
```

The above output informs us that this replica was scheduled with the
aforementioned placement constraints and is failing to start due to the
following reasons:

- No suitable node is available because the maximum replicas per node has been
  met on all worker nodes.
- The other three nodes are drained, so they are not available for new tasks.

As a sanity check, we can confirm that there are, in fact, two service replicas
already running on each node:

```command
docker node ps worker-1
```

```text
[output]
ID             NAME            IMAGE          NODE       DESIRED STATE   CURRENT STATE            ERROR     PORTS
ikq7t6neux8n   nginx_nginx.1   nginx:latest   worker-1   Running         Running 13 minutes ago
5kl334ckqook   nginx_nginx.3   nginx:latest   worker-1   Running         Running 13 minutes ago
```

```command
docker node ps worker-2
```

```text
[output]
ID             NAME            IMAGE          NODE       DESIRED STATE   CURRENT STATE            ERROR     PORTS
gxanzkz032ih   nginx_nginx.2   nginx:latest   worker-2   Running         Running 13 minutes ago
zj7voybfjvz1   nginx_nginx.4   nginx:latest   worker-2   Running         Running 13 minutes ago
```

In short, `worker-1` is running the `nginx_nginx.1` and `nginx_nginx.3` service
replicas, while `worker-2` is running the `nginx_nginx.2` and `nginx_nginx.4`
replicas. In the next step, you will resolve the pending state of the
`nginx_nginx.5` replica by adding a new worker node to the cluster.

## Step 2 - Scaling out the cluster by two nodes

The obvious choice for resolving the pending state of the `nginx_nginx.5`
replica is to add a new worker node to the Docker Swarm cluster, such that it
can absorb that replica. To scale out the cluster, you will use the same
commands used to set it up in the first place.

```command
docker swarm
```

```text
Usage:  docker swarm COMMAND

Manage Swarm

Commands:
  ca          Display and rotate the root CA
  init        Initialize a swarm
  join        Join a swarm as a node and/or manager
  join-token  Manage join tokens
  leave       Leave the swarm
  unlock      Unlock swarm
  unlock-key  Manage the unlock key
  update      Update the swarm

Run 'docker swarm COMMAND --help' for more information on a command.
```

First, you need to retrieve the token and advertised address of the cluster so
that other nodes can join it:

```command
docker swarm join-token worker
```

This yields a `docker swarm join` command for worker nodes that needs to be
executed on the new node:

```text
[output]
To add a worker to this swarm, run the following command:

    [highlight]
    docker swarm join --token <worker_token> <manager_server_ip>:<port>
    [/highlight]
```

Log into your `worker-3` server and confirm that it isn't already part of a
Docker Swarm cluster:

```command
docker info --format 'Name: {{.Name}}, Swarm status: {{.Swarm}}'
```

```text
[output]
Name: worker-3, Swarm status: {  inactive false  [] 0 0 <nil> []}
```

It isn't! So you are good to paste and run the `join` command:

```command
docker swarm join --token <worker_token> <manager_server_ip>:<port>
```

```text
[output]
This node joined a swarm as a worker.
```

Fantastic! Let's confirm that this is true:

```command
docker info --format 'Name: {{.Name}}, Swarm status: {{json .Swarm}}'
```

```text
[output]
Name: worker-3, Swarm status: {"NodeID":"tzpzykain64bc5ymjvmepa7k2","NodeAddr":"95.217.1.46","LocalNodeState":"active","ControlAvailable":false,"Error":"","RemoteManagers":[{"NodeID":"9r83zto8qpqiazt6slxfkjypq","Addr":"116.203.21.130:2377"},{"NodeID":"uspt9qwqnzqwl78gbxc7omja7","Addr":"167.235.135.73:2377"},{"NodeID":"txrdxwuwjpg5jjfer3bcmtc5r","Addr":"167.235.237.232:2377"}]}
```

Docker is telling us that the `worker-3` server is indeed part of a Swarm
cluster, and that it has three remote manager nodes:
`sjfk20xz5gewiian2jmorkjrj`, `egyuy133wuvh3xpjha9gst7j4`, and
`hh5i437w4tm7ucgkx5j6g7sx3`. These `NodeID`s look a bit cryptic at first, but
when you compare them with the output from your `docker node ls` command right
at the beginning of step 1 above, you will notice that it matches perfectly with
your cluster's `manager-1`, `manager-2`, and `manager-3` nodes respectively.

Next, log into your `worker-4` server, and, after making sure it also isn't
already running in Swarm mode, re-run the same join command:

```command
docker swarm join --token <worker_token> <manager_server_ip>:<port>
```

```text
[output]
This node joined a swarm as a worker.
```

As before, a quick inspection will tell you that the `worker-4` server has also
been added to your Swarm cluster, under the management of your three well-known
manager nodes:

```command
docker info --format 'Name: {{.Name}}, Swarm status: {{.Swarm}}'
```

```text
[output]
Name: worker-4, Swarm status: {norrldqnefib7l8emhrq3kmyc 65.21.53.113 active false  [{9r83zto8qpqiazt6slxfkjypq 116.203.21.130:2377} {uspt9qwqnzqwl78gbxc7omja7 167.235.135.73:2377} {txrdxwuwjpg5jjfer3bcmtc5r 167.235.237.232:2377}] 0 0 <nil> []}
```

Now that you've added two new worker nodes to your cluster, head back to the
cluster's leader node (which is `manager-3` in this tutorial, but may be
different on your end). From here, let's also confirm this is true:

```command
docker node ls
```

```text
[output]
ID                            HOSTNAME    STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
9r83zto8qpqiazt6slxfkjypq     manager-1   Ready     Drain          Leader           20.10.18
uspt9qwqnzqwl78gbxc7omja7     manager-2   Ready     Drain          Reachable        20.10.18
txrdxwuwjpg5jjfer3bcmtc5r *   manager-3   Ready     Drain          Reachable        20.10.18
kaq8r9gec4t58yc9oh3dc0r2d     worker-1    Ready     Active                          20.10.18
vk1224zd81xcihgm1iis2703z     worker-2    Ready     Active                          20.10.18
[highlight]
tzpzykain64bc5ymjvmepa7k2     worker-3    Ready     Active                          20.10.18
norrldqnefib7l8emhrq3kmyc     worker-4    Ready     Active                          20.10.18
[/highlight]
```

As you can see, `worker-3` and `worker-4` are in the cluster, ready for action!
The question now is: was our pending service replica `nginx_nginx.5` picked up
by any of these two new worker nodes? Let's find out by executing the command
below on the leader node:

```command
docker service ls
```

```text
[output]
ID             NAME          MODE         REPLICAS               IMAGE          PORTS
ayyax6sx0dyb   nginx_nginx   replicated   5/5 (max 2 per node)   nginx:latest   *:8088->80/tcp
```

So far so good; all five replicas seem to be running.

```command
docker service ps nginx_nginx
```

```text
[output]
ID             NAME            IMAGE          NODE       DESIRED STATE   CURRENT STATE            ERROR     PORTS
ikq7t6neux8n   nginx_nginx.1   nginx:latest   worker-1   Running         Running 35 hours ago
gxanzkz032ih   nginx_nginx.2   nginx:latest   worker-2   Running         Running 35 hours ago
5kl334ckqook   nginx_nginx.3   nginx:latest   worker-1   Running         Running 35 hours ago
zj7voybfjvz1   nginx_nginx.4   nginx:latest   worker-2   Running         Running 35 hours ago
uq7cnb2jup1v   nginx_nginx.5   nginx:latest   worker-3   Running         Running 48 minutes ago
```

The list of service tasks also shows that the "nginx_nginx.5" is now running!
You can run the `inspect` command to confirm that all is healthy, and that this
previously pending task now has a container associated with it (install `jq`
first):

```command
sudo apt install jq
```

```command
docker inspect [highlight]<nginx_nginx.5_id>[/highlight] --format '{{json .Status}}' | jq
```

```text
[output]
{
  "Timestamp": "2022-10-13T09:53:23.223355629Z",
  "State": "running",
  "Message": "started",
  "ContainerStatus": {
    "ContainerID": "e55e6f85ccda500d6c60f40a6bc9dded9515f828d412222242806390a84ec8e6",
    "PID": 24162,
    "ExitCode": 0
  },
  "PortStatus": {}
}
```

Finally, considering the order in which you've scaled out the cluster, it would
be logical to assume that the first new node (`worker-3`) picked up this task.
Run the command below to verify:

```command
docker node ps worker-3
```

```text
[output]
ID             NAME            IMAGE          NODE       DESIRED STATE   CURRENT STATE               ERROR     PORTS
uq7cnb2jup1v   nginx_nginx.5   nginx:latest   worker-3   Running         Running about an hour ago
```

## Step 3 — Scaling out the managers by promoting a worker node

In step two, you scaled out the entire cluster by adding two new worker nodes,
and this gives you the ability to add three more replicas of the `nginx` service
according to the current placement constraints. If you want to add a new manager
node instead of a worker, there are two main possibilities:

1. When adding a new node to the cluster, use the manager join instead of the
   worker join command. To obtain the manager join-token, you can run the
   command below on any existing manager node:

   ```command
   docker swarm join-token manager
   ```

2. Promote an existing worker node to a manager node.

We will utilize the latter strategy in this tutorial. At the moment, we have a
7-node Swarm cluster with three managers and four workers (two of which have
been recently added). For the sake of simplicity, let's choose a worker node
that is not running any tasks. The best candidate is `worker-4`, the latest
worker to join the cluster :

```command
docker node ps worker-4
```

```text
[output]
ID        NAME      IMAGE     NODE      DESIRED STATE   CURRENT STATE   ERROR     PORTS
```

Double-check that the `worker-4` node has the role of `worker`:

```command
docker node inspect worker-4 --format '{{.Spec.Role}}'
```

```text
[output]
worker
```

It all checks out, so let's proceed to the promotion step. The `docker node`
directive handles promotions and demotions:

```command
docker node
```

```text
[output]
Usage:  docker node COMMAND

Manage Swarm nodes

Commands:
  [highlight]
  demote      Demote one or more nodes from manager in the swarm
  [/highlight]
  inspect     Display detailed information on one or more nodes
  ls          List nodes in the swarm
  [highlight]
  promote     Promote one or more nodes to manager in the swarm
  [/highlight]
  ps          List tasks running on one or more nodes, defaults to current node
  rm          Remove one or more nodes from the swarm
  update      Update a node

Run 'docker node COMMAND --help' for more information on a command.
```

Promotions are as simple as providing the ID of the node you want to promote:

```command
docker node promote --help
```

```text
Usage:  docker node promote NODE [NODE...]

Promote one or more nodes to manager in the swarm
```

Before we proceed with the promotion of the `worker-4` node, a side note must be
made here with respect to how the cluster manager nodes work, and the concept of
a "quorum".

Each Docker Swarm cluster has one or more manager nodes, which are responsible
for managing the cluster and storing the swarm state (we currently have three
manager nodes in our cluster). In order to manage the swarm state, these nodes
talk with each other using the
[Raft Consensus Algorithm](https://docs.docker.com/engine/swarm/raft/), so that
all decisions are consensual. This operational behavior makes it so that the
number of manager nodes actually plays an important role in the whole cluster.

Even though you can have as many manager nodes as you want, you must consider
that with more manager nodes, there will be more jittering (due to the way the
Raft Consensus algorithm works). Therefore, the more fault-tolerant the cluster
is, the less performant it will be.

Another critical aspect to consider is the cluster's quorum. The Raft Consensus
algorithm requires a majority of the manager nodes to participate in the
management decision. If the quorum is lost, the managers will no longer be able
to update the swarm state. Therefore, it is necessary to understand how many
managers can you lose, before also losing the quorum (this is our fault
tolerance). You can read more about this in the
[official documentation](https://docs.docker.com/engine/swarm/admin_guide/) .

For our use case, we already have three manager nodes. Our current fault
tolerance is **one** manager node (meaning that we can lose one manager node
without interrupting cluster operations). By continuing with our current
exercise, you will add one more manager node, meaning that we'll end up with
four manager nodes, for which [the fault tolerance is still
one](https://betterstack.com/community/guides/scaling-docker/ha-docker-swarm/)!

Having said this, please consider this example as a pure demonstration of a
promotion process, knowing that we are gaining nothing by adding just one more
manager node to our cluster (and we're actually reducing performance).

---

Go ahead and promote `worker-4` to manager status:

```command
docker node promote worker-4
```

```text
[output]
Node worker-4 promoted to a manager in the swarm.
```

When listing the cluster nodes once again, you'll observe that `worker-4` is now
a manager:

```command
docker node ls
```

```text
[output]
ID                            HOSTNAME    STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
9r83zto8qpqiazt6slxfkjypq     manager-1   Ready     Drain          Leader           20.10.18
uspt9qwqnzqwl78gbxc7omja7     manager-2   Ready     Drain          Reachable        20.10.18
txrdxwuwjpg5jjfer3bcmtc5r *   manager-3   Ready     Drain          Reachable        20.10.18
kaq8r9gec4t58yc9oh3dc0r2d     worker-1    Ready     Active                          20.10.18
vk1224zd81xcihgm1iis2703z     worker-2    Ready     Active                          20.10.18
tzpzykain64bc5ymjvmepa7k2     worker-3    Ready     Active                          20.10.18
[highlight]
norrldqnefib7l8emhrq3kmyc     worker-4    Ready     Active         Reachable        20.10.18
[/highlight]
```

And a node-specific inspection will confirm the same:

```command
docker node inspect worker-4 --format '{{.Spec.Role}}'
```

```text
[output]
manager
```

Finally, as a sanity check, let's confirm that this recent node promotion hasn't
affected our existing `nginx_nginx` service:

```command
docker service ps nginx_nginx
```

```text
[output]
ID             NAME            IMAGE          NODE       DESIRED STATE   CURRENT STATE          ERROR     PORTS
ikq7t6neux8n   nginx_nginx.1   nginx:latest   worker-1   Running         Running 36 hours ago
gxanzkz032ih   nginx_nginx.2   nginx:latest   worker-2   Running         Running 36 hours ago
5kl334ckqook   nginx_nginx.3   nginx:latest   worker-1   Running         Running 36 hours ago
zj7voybfjvz1   nginx_nginx.4   nginx:latest   worker-2   Running         Running 36 hours ago
uq7cnb2jup1v   nginx_nginx.5   nginx:latest   worker-3   Running         Running 2 hours ago
```

All good! Since `worker-4` isn't running any service tasks, the `nginx_nginx`
service was left unaltered. Now that the `worker-4` node has been promoted to a
manager, it makes no sense to keep referring to it as `worker-4`. A name like
`manager-4` would be more appropriate, so let's go ahead and rename it.

Log into the `worker-4` server and change its hostname using the command below
(enter your password when prompted):

```command
hostnamectl set-hostname manager-4
```

Afterward, restart the `docker` service on the server:

```command
sudo systemctl restart docker
```

You may run the command below to verify that your changes have been effected in
the Swarm cluster:

```command
docker node ls
```

```text
[output]
ID                            HOSTNAME    STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
9r83zto8qpqiazt6slxfkjypq     manager-1   Ready     Drain          Leader           20.10.18
uspt9qwqnzqwl78gbxc7omja7     manager-2   Ready     Drain          Reachable        20.10.18
txrdxwuwjpg5jjfer3bcmtc5r     manager-3   Ready     Drain          Reachable        20.10.18
[highlight]
norrldqnefib7l8emhrq3kmyc *   manager-4   Ready     Active         Reachable        20.10.18
[/highlight]
kaq8r9gec4t58yc9oh3dc0r2d     worker-1    Ready     Active                          20.10.18
vk1224zd81xcihgm1iis2703z     worker-2    Ready     Active                          20.10.18
tzpzykain64bc5ymjvmepa7k2     worker-3    Ready     Active                          20.10.18
```

You leader node may change after restarting the `docker` service. In this case
it changed from `manager-3` to `manager-1`.

## Step 4 — Preventing a node from receiving new tasks

Although we've promoted a cluster worker node to manager status, it remains
available for accepting new tasks, as evidenced by the `Active` availability in
the previous output. As explained in [this article](https://betterstack.com/community/guides/scaling-docker/ha-docker-swarm/), its not
ideal to run Swarm tasks on manager nodes to protect them as much as possible.
Therefore, to prevent this `manager-4` node from receiving new tasks we must
update it by setting its availability to "drain". This setting ensures that the
node won't be available to run new tasks, and existing tasks will be gracefully
shut down and re-scheduled on an available worker node.

Let's see how the node update command works:

```command
docker node update --help
```

```text
Usage:  docker node update [OPTIONS] NODE

Update a node

Options:
      --availability string   Availability of the node ("active"|"pause"|"drain")
      --label-add list        Add or update a node label (key=value)
      --label-rm list         Remove a node label if exists
      --role string           Role of the node ("worker"|"manager")
```

Before draining the `manager-4` node, note that the command below would have
been a suitable alternative for our promotion command in the previous step. Both
instructions exhibit the same behavior.

```command
docker node update --role manager worker-4 # don't run this
```

Let's confirm the availability status of the `manager-4` node first before
draining it:

```command
docker node inspect manager-4 --format '{{.Spec.Availability}}'
```

```text
[output]
active
```

It is active, so it can receive tasks at the moment. Let's drain it then:

```command
docker node update --availability drain manager-4
```

```text
[output]
manager-4
```

The output is not very enlightening, but we can inspect the node to confirm the
operation:

```command
docker node inspect manager-4 --format '{{.Spec.Availability}}'
```

```text
drain
```

The output above confirms that the `manager-4` node is no longer able to receive
any new tasks! This information should also be evident when listing the cluster
nodes:

```command
docker node ls
```

```text
ID                            HOSTNAME    STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
9r83zto8qpqiazt6slxfkjypq *   manager-1   Ready     Drain          Leader           20.10.18
uspt9qwqnzqwl78gbxc7omja7     manager-2   Ready     Drain          Reachable        20.10.18
txrdxwuwjpg5jjfer3bcmtc5r     manager-3   Ready     Drain          Reachable        20.10.18
[highlight]
norrldqnefib7l8emhrq3kmyc     manager-4   Ready     Drain          Reachable        20.10.18
[/highlight]
kaq8r9gec4t58yc9oh3dc0r2d     worker-1    Ready     Active                          20.10.18
vk1224zd81xcihgm1iis2703z     worker-2    Ready     Active                          20.10.18
tzpzykain64bc5ymjvmepa7k2     worker-3    Ready     Active                          20.10.18
```

## Step 5 - Gracefully scaling in the cluster by one node

The final step in this tutorial will demonstrate a reduction in the size of our
cluster (thus scaling in). To do this, one could simply force the removal of an
existing node through the `rm` command:

```command
docker node rm --help
```

```text
[output]
Usage:  docker node rm [OPTIONS] NODE [NODE...]

Remove one or more nodes from the swarm

Aliases:
  rm, remove

Options:
  -f, --force   Force remove a node from the swarm
```

However, this wouldn't be a graceful scaling operation, as we could unknowingly
remove a node that is conducting important business operations within the
cluster (e.g. executing service tasks). We should only use the `docker node rm`
command whenever a cluster node is already down.

Let's drain the `worker-3` node, since we know it is a worker node, and thus
shouldn't affect the cluster quorum.

```command
docker node update --availability drain worker-3
```

```text
[output]
worker-3
```

As expected, since this `worker-3` node was executing a service task, said
service task will be gracefully stopped and marked for re-allocation somewhere
else in the cluster. However, given our service's placement constraints, this
service task will go back to the same state as in the beginning of the tutorial,
having no suitable worker node where to execute:

```command
docker service ps nginx_nginx
```

```text
[output]
ID             NAME                IMAGE          NODE       DESIRED STATE   CURRENT STATE             ERROR                              PORTS
ikq7t6neux8n   nginx_nginx.1       nginx:latest   worker-1   Running         Running 5 days ago
gxanzkz032ih   nginx_nginx.2       nginx:latest   worker-2   Running         Running 5 days ago
5kl334ckqook   nginx_nginx.3       nginx:latest   worker-1   Running         Running 5 days ago
zj7voybfjvz1   nginx_nginx.4       nginx:latest   worker-2   Running         Running 5 days ago
[highlight]
qkzrxpwi8pvk   nginx_nginx.5       nginx:latest              Running         Pending 39 seconds ago    "no suitable node (5 nodes not…"
uq7cnb2jup1v    \_ nginx_nginx.5   nginx:latest   worker-3   Shutdown        Shutdown 35 seconds ago
[/highlight]
```

This is because the other two worker nodes have a maximum capacity of two tasks,
and the third worker node has been drained. Here's the current state of our
cluster:

```command
docker node ls
```

```text
[output]
ID                            HOSTNAME    STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
9r83zto8qpqiazt6slxfkjypq *   manager-1   Ready     Drain          Leader           20.10.18
uspt9qwqnzqwl78gbxc7omja7     manager-2   Ready     Drain          Reachable        20.10.18
txrdxwuwjpg5jjfer3bcmtc5r     manager-3   Ready     Drain          Reachable        20.10.18
norrldqnefib7l8emhrq3kmyc     manager-4   Ready     Drain          Reachable        20.10.18
kaq8r9gec4t58yc9oh3dc0r2d     worker-1    Ready     Active                          20.10.18
vk1224zd81xcihgm1iis2703z     worker-2    Ready     Active                          20.10.18
tzpzykain64bc5ymjvmepa7k2     worker-3    Ready     Drain                           20.10.18
```

Now that the `worker-3` node has been drained, you can safely use
`docker node rm` to remove it from the cluster:

```command
docker node rm worker-3
```

```text
[output]
Error response from daemon: rpc error: code = FailedPrecondition desc = node tzpzykain64bc5ymjvmepa7k2 is not down and can't be removed
```

An error occurs here because the `worker-3` node isn't down despite being
drained, and it is still a part of the cluster. Even though you could force a
removal of this node (through the `-f` option), its best to leave the swarm
cluster first before re-running the `rm` command.

Go ahead and login into the `worker-3` server. Afterward, double check there
aren't any tasks running (since it has been drained):

```command
docker ps -a
```

```text
[output]
CONTAINER ID   IMAGE          COMMAND                  CREATED      STATUS                      PORTS     NAMES
e55e6f85ccda   nginx:latest   "/docker-entrypoint.…"   3 days ago   Exited (0) 46 minutes ago             nginx_nginx.5.uq7cnb2jup1vzmna8ormeaegi
```

As expected, the only task this node has in its history is the `nginx_nginx`
task which was recently stopped and is now awaiting a suitable worker node. It
is now safe for you to leave the cluster:

```command
docker swarm leave
```

```text
[output]
Node left the swarm.
```

All good! Now head back to the leader node in your cluster and run the command
below:

```command
docker node ls
```

The `worker-3` node should now be flagged as "Down":

```text
[output]
ID                            HOSTNAME    STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
9r83zto8qpqiazt6slxfkjypq *   manager-1   Ready     Drain          Leader           20.10.18
uspt9qwqnzqwl78gbxc7omja7     manager-2   Ready     Drain          Reachable        20.10.18
txrdxwuwjpg5jjfer3bcmtc5r     manager-3   Ready     Drain          Reachable        20.10.18
norrldqnefib7l8emhrq3kmyc     manager-4   Ready     Drain          Reachable        20.10.18
kaq8r9gec4t58yc9oh3dc0r2d     worker-1    Ready     Active                          20.10.18
vk1224zd81xcihgm1iis2703z     worker-2    Ready     Active                          20.10.18
[highlight]
tzpzykain64bc5ymjvmepa7k2     worker-3    Down      Drain                           20.10.18
[/highlight]
```

Having "Down" nodes still appear in the node list is useful, because those nodes
can come back to the cluster at any time. For example, a node can be temporarily
down due to a server reboot.

Since we are sure that the `worker-3` node is no longer needed, we can go ahead
and remove it from the cluster:

```command
docker node rm worker-3
```

```text
[output]
worker-3
```

At this point, `worker-3` should no longer be part of our cluster, and we should
now have a total of six nodes:

```command
docker node ls
```

```text
[output]
ID                            HOSTNAME    STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
9r83zto8qpqiazt6slxfkjypq *   manager-1   Ready     Drain          Leader           20.10.18
uspt9qwqnzqwl78gbxc7omja7     manager-2   Ready     Drain          Reachable        20.10.18
txrdxwuwjpg5jjfer3bcmtc5r     manager-3   Ready     Drain          Reachable        20.10.18
norrldqnefib7l8emhrq3kmyc     manager-4   Ready     Drain          Reachable        20.10.18
kaq8r9gec4t58yc9oh3dc0r2d     worker-1    Ready     Active                          20.10.18
vk1224zd81xcihgm1iis2703z     worker-2    Ready     Active                          20.10.18
```

## Conclusion and next steps

In this tutorial, you learned about scaling a Docker Swarm cluster in and out.
You can now fully inspect a cluster and know where services tasks are running,
the different roles of each node in the cluster, and how to find and handle
service tasks that are scattered throughout your cluster. You should also
understand how a cluster quorum works, and how to maintain an healthy cluster
while performing scaling operations such as adding, removing, and promoting
nodes.

You can learn more about running Docker containers in production by checking the
[official documentation](https://docs.docker.com/get-started/orchestration/),
perusing the rest of our [scaling docker tutorial series](https://betterstack.com/community/guides/scaling-docker/), or reading our [Docker logging guide](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/).

Thanks for reading, and happy scaling!

_This article was contributed by guest author
[Cristovao Cordeiro](https://twitter.com/@cristovaojdc), a Docker certified
Engineering Manager at Canonical. He's an expert in Containers and ex-CERN
engineer with 9+ years of experience in Cloud and Edge computing._
