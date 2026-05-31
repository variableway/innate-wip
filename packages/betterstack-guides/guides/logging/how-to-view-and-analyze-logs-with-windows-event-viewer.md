#  How To View And Analyze Logs With Windows Event Viewer

Logs are constantly recording what is going on on your computer. They can
provide help in tracking what happens with your machine or with troubleshooting.
Logs are kept about both actions by a person or by a running process.

In Windows, logs that are saved contain information about applications and the
operating system itself. Moreover, these logs are structured and human-readable.
For viewing the logs, Windows uses its **Windows Event Viewer.** This
application displays the event logs and allows the user to search, filter,
export, and analyze background info. In this article, you will learn how to use
the features provided with this program. In addition, this article will also
explore the Event Viewer's interface and features. Finally, you will also learn
about other application that has their own event viewer built-in, and we will
talk about creating your own repeating tasks.

## Prerequisites

- Windows 10 installed
- Administration privileges

[summary]
## Side note: Centralize logs across all your Windows servers

Head over to [Better Stack](https://betterstack.com/logs) and ship your Windows Event Logs to one dashboard. Stop logging into each server individually—aggregate, search, and alert on events across your entire infrastructure.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Step 1 — Accessing Event Viewer

Event viewer is a standard component and can be accessed in several ways. The
easiest way is to type `event viewer` to the start menu. If you prefer using
command prompt, you can access it by running the `eventvwr` command.

Event viewer is also accessible through the control panels. Open the control
panels and list them all by viewing them like small or large icons. After that,
select the Administrative Tools and find Event Viewer in the folder.

The application is user-friendly and provides an intuitive interface. The main
screen is divided into three column sections:

- Navigation page
- Detail page
- Action page

You can also create your own section. We will explain how to do that later in
the tutorial.

## Step 2 — Understanding Navigation Page

The navigation page, which is by default positioned on the very left, provides
you with an option to choose the event log to view. Five categories can be found
under **Windows logs**:

- **System** - Logs created by the operating system
- **Application**- Logged by an application hosted locally
- **Setup** - Logs created in the process of installing or changing the Windows
  installation
- **Security** - Logs related to logins, privileges, and other similar events
- **Forwarded Events** - Events forwarded by other computers

There is also a category for **Applications and Services Logs**, which contains
logs of the individual applications and Hardware Events. Logs from PowerShell
and other command lines will also be stored there.

## Step 3 — Viewing Log Details On Detail Page

When in the default tab, this page displays the Overview and Summary. Select
some item from the previously mentioned navigation page to see more details.
There are several log levels:

- **Information** - Successful action
- **Warning** - Occurring of an event that might bring problems
- **Error** - Occurring of a significant problem
- **Critical** - Severe problem occurred

You can also see Audit successes and failures, which are associated with
security events.

Events are listed chronologically, starting with the latest event on the very
top. You can furthermore click on the columns to edit the order and groupings.

You can click on the event to view more detailed information:
![Viewing Log Details On Detail Page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f2554cac-f35a-4a1b-d9bb-5104d3e9bb00/public =923x768)
You can learn more about an event by double-clicking it:
![Viewing Log Details On Detail Page 2](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0b3d5b18-4bed-49c2-dd26-effbff751100/public =1094x766)
Here you can see the name of the log, source, and other information about the
log.

The following popup window also has two tabs, **General** and **Details**. The
first tab shows more information about the error as described above. The second
tab shows the raw event data. You can switch between **Friendly View** and **XML
View**.

## Step 4 — Using Actions Page

The last page located by default on the right side is the **Actions page,**
which provides you quick access to the features available to you at the moment.
This page is divided into two parts, the first containing actions available for
the selected Navigation page. The second contains actions available to the
selected event itself.

Various options are available:

### Filtering Current Log

Allows you to set criteria for events to be displayed on the Details page.
![Filtering Current Log](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c1bd16c2-750c-4212-68f6-0c326bd8ab00/public =756x768)

### Clearing Log Events

You can choose this option if the list becomes too large. This will delete all
events stored in the current log. You can check the total number of events by
going to the top directory in the navigation page:
![Clearing Log Events](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/49e7ecb9-c8a5-4d31-a879-d6812a7e4200/public =1000x701)

### Exporting Log Events

You can click on the `Save All Events As`or `Save All Events in Custom View As`
to export all of the selected events into the special event file with the
`.EVTX` extension.

[ad-logs]

## Step 5 — Creating Custom Views

Event Viewer gives you the option to create a custom view. To do so, select the
**Custom Views** folder on the Navigation page and click **Create Custom View**
on the Actions page. You can, for example, create a custom view for all Windows
Azure events with log level error that occurred in the last 12 hours:
![Creating Custom Views](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fbb40b56-5991-462a-ce7b-7d53dcb4e000/public =756x768)
After saving, your new view will now show in the Navigation tab.

You can also export your Custom View. Select it in the Navigation Page and find
an option called `Export Custom View` on the Actions Page. Enter the name for
the new `.XML` file you are about to create, and it is done.

You can import the custom view to any other Event Viewer by selecting the option
`Import Custom View`.

## Navigating Summary View

The summary view is the first thing you will come in contact with when opening
the Event Viewer. It is at the top of the Navigation panel.
![Navigating Summary View](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/02d58726-9d1f-4f95-65f6-2fbb38412b00/public =1000x675)
It includes:

- **Overview**
- **Summary of Administrative Events** - displays data and totals related to the
  Event Viewer for the past week.
- **Recently Viewed Nodes** - history of the viewed nodes filtered
  chronologically while the most recent is at the top. You can double-click on
  the node to open the location.
- **Log Summary** - this section displays all of the major properties in each
  log file. Double-click to get more details like the events for the viewed log.

## Step 6 — Finding Other Application Logs

There are other logs with their event logging:

- **DNS Manager**
- **IIS Access**
- **Task Scheduler History**
- **Failover Cluster Manager**
- **Windows Component Service**

### DNS Manager

If you run Windows Server that is provisioned as a DNS server, the DNS manager
is available. This manager has its list of events. From there, the DNS manager's
event viewer works in a similar fashion as the one packed with Windows.

### IIS Access

The **Internet Information Services** logs include info about requested URIs and
statuses. These logs are written in the location specified in the IIS Manager.
By default, the location is:

    %SystemDrive%\\inetpub\\logs\\LogFiles

### Task Scheduler Library

Task scheduler schedules many sorts of background tasks and applications. The
Task Scheduler Library is associated with it, and you can view it directly from
the application:
![Task Scheduler Library](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e7d443cf-6458-4cc7-d2e9-a3166a520d00/public =1000x506)
From the summary view, you can see the overview, task status, and active tasks.
In the task status, you can view all tasks started in some period.
Double-clicking on the task will give you more information.

In the section underneath, you can see all the active tasks that are currently
enabled and have not expired. Then, by double-clicking on the summary info about
the task, which includes the task name, next run time, triggers, and location,
you can again view more information.

Using this feature, you can display details about every single task and modify
it accordingly. The action page also slightly changes, and a new section for the
selected item is viewed. You can run, end, disable, delete or export information
about the task at your will.

From the action panel, you can also create your own task by selecting the option
`Create Basic Task...` or adding an existing one with `Import Task...` After
clicking the first opinion, you are presented with a task creator wizard to add
name, description, triggers, action, and finish statement to your custom task.

### Failover Cluster Manager

This is a practical built-in application when running your Windows Server. This
service allows servers to work as a cluster. When one server's hardware fails,
it is automatically detected and replaced by the other server. All network is
then re-routed to the working instance.

This application also has its local Event Viewer. Using this event viewer, you
can discover more in the events of your clusters failing or not working as
expected.

### Windows Component Service

Another application is Windows Component Service Manager. It enables us to
configure DCOM applications on Windows. You can view its logs by clicking on the
local Event Viewer:
![Windows Component Service](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cba0ff08-389b-4d49-77cb-59beea4f2700/public =1000x507)

[summary]
## Side note: Visualize Windows logs across your infrastructure

Transform scattered Event Viewer logs into unified dashboards. [Better Stack](https://betterstack.com/logs) aggregates logs from all your Windows servers, IIS, DNS, and applications—giving you a single pane of glass for your entire stack.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Final thoughts

Windows and applications installed or associated with the operating system keep
records of various events. Understanding and finding these events can help you
if you are a system administrator, running your Windows server, or even just a
regular user.

Now you should know how to explore and use different methods to use these logs
to your advantage. In addition, you now know how to use the task scheduler and
create your own repeating tasks using it.
