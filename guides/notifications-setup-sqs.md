---
aside: false
outline: false
sidebar: false
---

# Setup SQS Notifications

This guide explains how to register an AWS SQS queue to receive device notifications via our platform.

Under the hood, this uses AWS SNS (Simple Notification Service) to deliver the notifications to your endpoint, which in turn has its [own documentation](https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html).

This page acts as a Lightbug specific summary of those steps, and how to set up your endpoint to receive the notifications.

## Prerequisites

- An AWS account with permissions to create and manage SQS queues and policies.
- An SQS queue created in your AWS account.

## 1. Queue Policy

Your SQS queue must allow our platform (via AWS SNS) to send messages.

Replace `YOUR_SQS_ARN` with your queue's ARN in both the policy and the code.

```
{
    "Version": "2012-10-17",
    "Id": "AllowLightbugPush",
    "Statement": [
     {
        "Sid": "AllowLightbugPush001",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "sqs:SendMessage",
        "Resource": "YOUR_SQS_ARN",
        "Condition": {
            "ArnEquals": {
                "aws:SourceArn": "arn:aws:sns:*:367158939173:*"
            }
        }
     }
    ]
}
```

See [AWS docs](https://docs.aws.amazon.com/sns/latest/dg/SendMessageToSQS.cross.account.html) for more details.

## 2. Notification Trigger

You can register your SQS queue to receive notifications [using the API](/apis/v1/get-devices-id-setupSqsForwarding).

You need to specify the device ID and `sqsArn` as well as an optional collection of types.

:::tip Default Notifications
By default SQS sends all new locations and readings to the target SQS queue.
:::

## 3. Confirmation

After registering, AWS SNS will send a `SubscriptionConfirmation` message to your SQS queue. **You must confirm the subscription** by visiting the `SubscribeURL` in the message. This step is required by AWS and is not automatic.

- Retrieve the `SubscriptionConfirmation` message from your SQS queue.
- Visit the `SubscribeURL` in a browser or with a tool like `curl`.
- Once confirmed, notifications will start arriving in your queue.

If you do not confirm, no further messages will be delivered.

## 4. Notification

Once confirmed, you'll receive notifications from SNS.

## Troubleshooting

- **No confirmation message?**
  - Double-check your SQS policy and ARN.
  - Ensure the queue is in the correct AWS region.
  - Make sure the trigger registration succeeded.
- **Still not working?**
  - Contact support with your account name, SQS ARN and device ID for assistance.
