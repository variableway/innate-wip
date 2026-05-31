# Getting Started with AWS CloudTrail Logs

Imagine waking up to an AWS security nightmare. Would you be prepared to handle
it?

Let's say you logged into your AWS account and see your critical databases gone.
Or maybe you spot strange EC2 instances you don't recognize racking up massive
bills. These aren't far-fetched scenarios – a single stolen credential can make
it happen.

Companies like
[Code Spaces](https://thehackernews.com/2014/06/cyber-attack-on-code-spaces-puts.html)
have learned the hard way. After their AWS credentials were leaked, all their
instances were deliberately wiped out which lead to them going out of business.

The good news is that you can prevent such a doomsday scenario from happening to
you by using
[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
to identify possible malicious behavior before it spirals out of control.

CloudTrail is your digital detective when things go wrong in AWS. It tracks who
did what and when. Think of it like a security camera for your cloud
environment.

In this guide, you will learn about the various logs collected by CloudTrail and
how them to monitor the activity in your AWS account.

[ad-logs]

## Understanding AWS CloudTrail audit logs

AWS CloudTrail automatically logs a wide range of activities within your AWS
account. These activities, captured from the AWS Management Console, Command
Line Interface (CLI), SDKs/APIs, and even automated AWS processes, are
categorized into three primary event types:

### 1. Management events

Management events (also known as control plane operations) provide visibility
into actions that modify the configuration of your AWS resources and services.
They essentially record the "who, what, when, and from where" of actions within
your AWS account.

Some examples of management events include:

- Creating or editing IAM roles, policies, or users.
- Changing security group configurations.
- Launching an Amazon EC2 instance or Amazon RDS database.
- Creating or deleting an S3 bucket.
- Configuring a CloudTrail trail.

Management events also include
[non-API events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-non-api-events.html)
like user logins or other AWS service events not directly triggered by an API
request.

For example, the event below describes an AWS console login (via `eventType`)
which was performed by the `root` user (see `userIdentity`) with Multi-Factor
Authentication enabled (`additionalEventData.MFAUsed`):

```json
{
    "eventVersion": "1.08",
    "userIdentity": {
        "type": "Root",
        "principalId": "444455556666",
        "arn": "arn:aws:iam::444455556666:root",
        "accountId": "444455556666",
        "accessKeyId": ""
    },
    "eventTime": "2023-07-13T03:04:43Z",
    "eventSource": "signin.amazonaws.com",
    "eventName": "ConsoleLogin",
    "awsRegion": "us-east-1",
    "sourceIPAddress": "192.0.2.0",
    "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "requestParameters": null,
    "responseElements": {
        "ConsoleLogin": "Success"
    },
    "additionalEventData": {
        "LoginTo": "https://ap-southeast-1.console.aws.amazon.com/ec2/home?region=ap-southeast-1&state=hashArgs%23Instances%3Av%3D3%3B%24case%3Dtags%3Atrue%255C%2Cclient%3Afalse%3B%24regex%3Dtags%3Afalse%255C%2Cclient%3Afalse&isauthcode=true",
        "MobileVersion": "No",
        "MFAIdentifier": "arn:aws:iam::444455556666:mfa/root-account-mfa-device",
        "MFAUsed": "Yes"
    },
    "eventID": "e0176723-ea76-4275-83a3-EXAMPLEf03fb",
    "readOnly": false,
    "eventType": "AwsConsoleSignIn",
    "managementEvent": true,
    "recipientAccountId": "444455556666",
    "eventCategory": "Management",
    "tlsDetails": {
        "tlsVersion": "TLSv1.3",
        "cipherSuite": "TLS_AES_128_GCM_SHA256",
        "clientProvidedHostHeader": "signin.aws.amazon.com"
    }
}
```

By default, CloudTrail automatically logs management events for all AWS
accounts. You can find these events for the past 90 days in the CloudTrail
console under **Event history**.

![cloudtrail-event-history.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f5a82345-6349-4aca-012a-9007bdb3f800/orig =3400x908)

### 2. Data events

Data events, also known as data plane operations, provide deeper visibility into
the resource operations performed on or within an AWS resource. They help
capture high-volume activities related to how users and applications interact
with your AWS resources.

Some examples of data events include:

- Invoking a Lambda function.
- Sending a message to an SNS topic.
- Uploading, downloading, or deleting files from an S3 bucket.
- Adding, modifying, or removing items from a DynamoDB table.

Unlike management events, data events require explicit configuration to be
tracked in CloudTrail because of the high-volume nature of the events being
captured.

```json
{
    "eventVersion": "1.08",
    "userIdentity": {
        "type": "IAMUser",
        "principalId": "EXAMPLEPAI123456789",
        "arn": "arn:aws:iam::123456789012:user/John",
        "accountId": "123456789012",
        "accessKeyId": "EXAMPLEKEYID123456789",
        "userName": "John"
    },
    "eventTime": "2024-04-11T12:34:56Z",
    "eventSource": "s3.amazonaws.com",
    "eventName": "GetObject",
    "awsRegion": "us-west-2",
    "sourceIPAddress": "203.0.113.42",
    "userAgent": "Amazon CloudFront",
    "requestParameters": {
        "bucketName": "example-bucket",
        "key": "example-object.txt"
    },
    "responseElements": null,
    "additionalEventData": {
        "x-amz-id-2": "ExampleRequestId123456789",
        "x-amz-request-id": "ExampleRequestId-1234-1234-1234-123456789abc"
    },
    "requestID": "ExampleRequestID-1234-1234-1234-123456789abc",
    "eventID": "ExampleEventID-1234-1234-1234-123456789abc",
    "readOnly": true,
    "resources": [
        {
            "type": "AWS::S3::Object",
            "ARN": "arn:aws:s3:::example-bucket/example-object.txt"
        },
        {
            "accountId": "123456789012",
            "type": "AWS::S3::Bucket",
            "ARN": "arn:aws:s3:::example-bucket"
        }
    ],
    "eventType": "AwsApiCall",
    "managementEvent": false,
    "recipientAccountId": "123456789012",
    "sharedEventID": "ExampleSharedEventID-1234-1234-1234-123456789abc",
    "eventCategory": "Data"
}
```

The above example demonstrates a data event where an IAM user named John
performs a `GetObject` request to download an object from an S3 bucket. The
event captures details details such as the event time, the AWS region
(us-west-2), the source IP address, and the specifics of the request itself.

### 3. Insights events

Insights events are special events generated by CloudTrail that signal
potentially unusual or unexpected activity within your AWS account.

Unlike standard management or data events that simply log every API call,
Insights events indicate deviations from your established baseline of normal
activity. They are designed to proactively alert you to potential security
incidents or operational issues.

Once CloudTrail Insights is enabled, it starts analyzing management events to
detect unusual API activity. It does this by analyzing your normal patterns of
API call volume and API error rates, also called the baseline, and generating
Insights events when the call volume or error rates are outside normal patterns.

---

Now, let's dive deeper into management events and how they can help you audit
your AWS environment.

## Accessing management events in CloudTrail

Once you navigate to the CloudTrail service, click on the **Event history** tab
to view your management events from the last 90 days.

You can customize your view by selecting how adjusting the number of events per
page or selecting visible columns. You can also select up to five events and
compare them side by side, or view the event record in full by clicking on it:

![event-comparison.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/63dcda4f-64ff-43db-df87-09e56e674400/lg1x =2876x1002)

![event-details.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e3a29c04-e652-4cc0-66ed-d2f86b0afa00/md2x =3308x1862)

## Understanding CloudTrail management events structure

Interpreting AWS CloudTrail management events involves understanding the
structure of the events and knowing how to analyze the data to draw insights
about actions taken within your AWS environment. In this section, you will learn
how to interpret management event logs so that you can understand what to focus
on when conducting investigations.

Since each CloudTrail event is written as a JSON object, there are several
fields that are common to all of the event types such as the following:

### eventName

This is the name of the action that was performed which is useful for detecting
notable occurrences in your AWS account. Here are some notable ones that you
should probably be alerting on:

- `ConsoleLogin`: Attempts to sign into the AWS Management console, especially
  as the root user or other administrative accounts.
- `StopLogging`: The suspension of CloudTrail logs, maliciously or otherwise.
- `DeleteTrail`, `UpdateTrail`: Requests to update or delete a trail.
- `CreateNetworkAclEntry`, `CreateRoute`: New ACL entries and routes in your
  network tables can reveal new attack vectors to your infrastructure.
- `AuthorizeSecurityGroupEgress`, `AuthorizeSecurityGroupIngress`,
  `RevokeSecurityGroupEgress`, `RevokeSecurityGroupIngress`: Changes to security
  group ingress and egress settings.
- `CreateUser`, `CreateRole`, `ChangePassword`, etc: Changes to user roles and
  permissions in IAM.
- `ListBuckets`, `PutBucketPolicy`

### awsRegion

This is the
[AWS Region](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-supported-regions.html)
that the request was made to.

### eventSource

This refers to the service that the request was made to and is usually the
service name suffixed by `.amazonaws.com` such as `logs.amazonaws.com`,
`signin.amazonaws.com`, `ec2.amazonaws.com` and similar.

### sourceIPAddress

This is the IP Address of the client that made the request, but it could also be
a DNS name if the event was triggered by AWS.

### errorCode and errorMessage

The `errorCode` field will be populated if the request returns an error and it
will be accompanied by an `errorMessage` that describes the error. You may want
to setup alerts on
[specific error types](https://docs.aws.amazon.com/awscloudtrail/latest/APIReference/CommonErrors.html)
or when you're experiencing a run of errors in your account.

### requestParameters and responseElements

If any parameters were sent with the request, they will be presented in the
`requestParameters` field. On the other hand, the `responseElements` field only
appears for events that may make changes to AWS resources (create, update, or
delete actions).

### additionalEventData

This contains additional details about an event that is not part of the request
or response.

### readOnly

![read-only-filter.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/45cdb396-850b-4016-a097-c187abb4b400/md2x =1811x439)

The `readOnly` property is `true` for events that do not modify any AWS
resources and `false` for events that may modify AWS resources

Read-only events are generally prefixed with `Get`, `Lookup`, `Describe`, `List`
or similar, while write events are prefixed with `Update`, `Create`, `Delete`,
`Publish`, etc.

### userIdentity

This is an object containing information the type of IAM identity that made the
request, which credentials were used, and in the case of temporary credentials,
how the credentials were obtained.

Here's an example of a `userIdentity` object for an event triggered by the
`Root` user:

```json
"userIdentity": {
    "type": "Root",
    "principalId": "121663830981",
    "arn": "arn:aws:iam::121663830981:root",
    "accountId": "121663830981",
    "accessKeyId": ""
}
```

And here's one for a request made with temporary security credentials obtained
by assuming an IAM role. The object contains additional details about the role
that was assumed to get credentials:

```json
"userIdentity": {
    "type": "AssumedRole",
    "principalId": "AROARYU52XPC6TGBE3BH7:myHTTPRequestFunc",
    "arn": "arn:aws:sts::121663830981:assumed-role/me/myHTTPRequestFunc",
    "accountId": "121663830981",
    "accessKeyId": "ASIARYU52XPC5GYD2LMQ",
    "sessionContext": {
        "sessionIssuer": {
            "type": "Role",
            "principalId": "AROARYU52XPC6TGBE3BH7",
            "arn": "arn:aws:iam::121663830981:role/example",
            "accountId": "121663830981",
            "userName": "example"
        },
        "attributes": {
            "creationDate": "2024-04-10T20:01:35Z",
            "mfaAuthenticated": "false"
        }
    }
},
```

Let's look at a few of the key properties in this object next:

#### userIdentity.type

The `type` field describes the identity of the user of service that was
responsible for the event which could be one of the following (see
[here](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-user-identity.html#cloudtrail-event-reference-user-identity-fields)
for the complete list):

- `Root`: This means the event was triggered by your AWS account ID or its
  [alias](https://docs.aws.amazon.com/signin/latest/userguide/console_account-alias.html).
  Since the root user has full access to all your resources for all AWS
  services, it is critical to minimize its use
  [except where unavoidable](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-tasks.html),
  and loudly alert on its usage. For more information about AWS recommendations,
  see the
  [Root user best practices document](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html).

- `IAMUser`: This indicates that the event was triggered by an `IAMUser`. If
  such activity is suspicious, it could mean that the credentials for the user
  has been compromised.

- `AssumedRole`: This indicates that the event was triggered using temporary
  security credentials from the AWS Security Token Service (STS) AssumeRole API,
  and the `sessionContext.sessionIssuer` field provides information about the
  assumed role. To figure out what IAM user, Lambda function, EC2 user, or
  external user assumed the role, you can pass the `accessKeyId` value to the
  `aws cloudtrail lookup-events` command as follows:

  ```command
  aws cloudtrail lookup-events \
    --lookup-attributes 'AttributeKey=ResourceName,AttributeValue=<accessKeyId>' \
    --query 'Events[*]'
  ```

  You should observe a response that looks like this:

  ```json
  [output]
    [
      {
        "EventId": "d819f09f-6304-3729-affa-f13b3a1f76ad",
        "EventName": "AssumeRole",
        "ReadOnly": "true",
        "EventTime": "2024-04-10T21:01:35+01:00",
        "EventSource": "sts.amazonaws.com",
        "Resources": [
          {
            "ResourceType": "AWS::IAM::AccessKey",
            "ResourceName": "ASIARYU52XPC5GYD2LMQ"
          },
          {
            "ResourceType": "AWS::STS::AssumedRole",
            "ResourceName": "myHTTPRequestFunc"
          },
          {
            "ResourceType": "AWS::IAM::Role",
            "ResourceName": "arn:aws:iam::121663830981:role/example"
          }
        ],
       . . .
      }
    ]
  ```

  This shows that the `myHTTPRequestFunc` resource (a Lambda function) was what
  assumed the "example" role. Ensure to see the
  [lookup-events documentation](https://docs.aws.amazon.com/cli/latest/reference/cloudtrail/lookup-events.html)
  for more details.

- `FederatedUser`: This is similar to `AssumedRole`, except that the temporary
  credentials were granted by the AWS STS
  [GetFederationToken API](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetFederationToken.html)
  instead.

- `AWSAccount`: This means that the event was triggered by different AWS account
  altogether, hopefully one that you own. It could also indicate the presence of
  a backdoor to your account which must be investigated. The role assumption for
  both accounts can be linked with the `sharedEventID` field which will appear
  in the management event on both accounts:

  ```json
  {
    "eventVersion": "1.05",
    "userIdentity": {
      "type": "AWSAccount",
      "principalId": "AIDAQRSTUVWXYZEXAMPLE",
      "accountId": "777788889999"
    },
    "eventTime": "2014-07-18T15:07:39Z",
    "eventSource": "sts.amazonaws.com",
    "eventName": "AssumeRole",
    "awsRegion": "us-east-2",
    "sourceIPAddress": "192.0.2.101",
    "userAgent": "aws-cli/1.11.10 Python/2.7.8 Linux/3.2.45-0.6.wd.865.49.315.metal1.x86_64 botocore/1.4.67",
    "requestParameters": {
      "roleArn": "arn:aws:iam::111122223333:role/EC2-dev",
      "roleSessionName": "JohnDoe-EC2-dev",
      "sourceIdentity": "JohnDoe",
      "serialNumber": "arn:aws:iam::777788889999:mfa"
    },
    "responseElements": {
      "credentials": {
        "sessionToken": "<encoded session token blob>",
        "accessKeyId": "ASIAI44QH8DHBEXAMPLE",
        "expiration": "Jul 18, 2014, 4:07:39 PM"
      },
      "assumedRoleUser": {
        "assumedRoleId": "AIDAQRSTUVWXYZEXAMPLE:JohnDoe-EC2-dev",
        "arn": "arn:aws:sts::111122223333:assumed-role/EC2-dev/JohnDoe-EC2-dev"
        },
    "sourceIdentity": "JohnDoe"
    },
    "requestID": "4EXAMPLE-0e8d-11e4-96e4-e55c0EXAMPLE",
    "sharedEventID": "bEXAMPLE-efea-4a70-b951-19a88EXAMPLE",
    "eventID": "dEXAMPLE-ac7f-466c-a608-4ac8dEXAMPLE"
  }
  ```

- `AWSService`: This is used when the event is initiated by an account that
  belongs to an AWS service. Many AWS services use service accounts to perform
  automated actions on your behalf.

#### userIdentity.principalId

This is a unique ID that identifies the entity that created the event. If
temporary credentials from `AssumeRole`, `AssumeRoleWithWebIdentity`, or
`GetFederationToken` are used, you'll see the session name of the role
assumption after this identifier. Note that this name is chosen by the client
assuming the role, so it may be misleading if an attacker is involved.

With Lambda functions, the name of the function assuming the role will be
appended to the `principalId`:

```text
AIDAQRSTUVWXYZEXAMPLE:<lambda_function-name>
```

Similarly, with EC2 instances, the instance ID will be appended like this:

```text
AIDAQRSTUVWXYZEXAMPLE:<instance_id>
```

#### userIdentity.ARN

This is the
[Amazon Resource Name](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html)
(ARN) of the entity that triggered the event.

#### userIdentity.accountID

![account-id.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a5ab7c43-9f15-41ae-ec78-cd02323c9700/lg2x =2167x586)

This refers to the account that owns the entity that granted permissions for the
request. If you're operating out of a single account, then this should always be
the same as your account ID. It makes sense to create a rule that alerts you
when other account IDs start showing up as it could mean that you've been
backdoored by a malicious AWS account.

#### userIdentity.accessKeyId

This the access key ID used to sign the request. Access key IDs prefixed with
`AKIA` are long-term credentials for an IAM user or the AWS account root user,
while those beginning with `ASIA` are temporary credentials that are created
using AWS STS operations.

If the `accountID` in the response belongs to you, you can sign in as the root
user and review your root user access keys. Then, you can pull a
[credentials report](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_getting-report.html)
to learn which IAM user owns the keys. To learn who requested the temporary
credentials for an ASIA access key, use the `lookup-events` command described
earlier.

#### userIdentity.sessionContext

The `sessionContext` field only appears if the event was created using temporary
credentials. It is an object that provides information about the session created
for those credentials such as when the credentials were issued
(`attributes.creationDate`) and if the root or IAM user behind the event used
Multi-Factor Authentication (`attributes.mfaAuthenticated`).

The `sessionContext.sessionIssuer` property also provides details about the
specific object that granted the credentials to assume the role. This is usually
a `Role`, but it could also be `Root` or `IAMUser`.

## Final thoughts

AWS security is complex, and breaches can happen for a million reasons. Maybe
the examples we covered won't be exactly what you face. But, by understanding
how CloudTrail works, you'll be better equipped to identify what's normal,
what's suspicious, and how to act fast when things go wrong.

Don't just read this guide – explore your own CloudTrail logs and get familiar
with them. Set up alerts for the truly critical stuff and ensure you implement
the recommended
[security best practices](https://aws.amazon.com/architecture/security-identity-compliance/?cards-all.sort-by=item.additionalFields.sortDate&cards-all.sort-order=desc&awsf.content-type=*all&awsf.methodology=*all)

Thanks for reading, and happy logging!