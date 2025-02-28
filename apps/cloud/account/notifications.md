# Notifications

Customise how you would like to receive notifications for your account.

![](https://i.imgur.com/XCb9yCi.png)

## Mobile Push

Receive notifications on your mobile device via the Lightbug app.

::: info
If you have installed the app on multiple devices with the same account login, all your devices will receive the notifications.
:::

Mobile push notifications will look something like this.

![](https://i.imgur.com/4merDoi.png)

## Email

Receive notifications via email, to the email registered with your account.

Notifications will look something like this.

![](https://i.imgur.com/teZScXJ.png)

## API Push

Receive notifications via API push (webhooks).

![](https://i.imgur.com/48NqjQj.png)

When enabled, you can set up the URL where you would like to receive the notifications.

::: warning
You should configure your endpoint to receive messages before configuring the API push notifications.
API push notifications require confirmation, which is sent shortly after enabling and configuring the feature.
If you miss this POSTed JSON, please alter your endpoint URL or contact us.
:::

### Confirmation

Once you have enabled the API push notifications, and an event has triggered that would cause a notification, you will receive a confirmation message to the URL you have set up.

The message will be in JSON format and will contain the following:

```json
{
  "Type": "SubscriptionConfirmation",
  "MessageId": "63c257f9-a5d7-449c-a4ab-769707dab857",
  "Token": "8936412f37fb687f5d51e6e2425ba1f25480c7e7646e0393d30ccc84655338dee5e845c6b08e443f75aa976d915691e8b2bbfc7f8eb6a40114cd1a9c1cbe2e4c7f2de792aec925e7ad47bfcdbfbe8ddfba0052e3724a712029b7868d5e7b00e98b493350955c8615d4e1a0b9ee8ea0175503678cb0d57dea9aaa0f5792091f4c25d49bc05dad423c12850b9cca60a899",
  "TopicArn": "arn:aws:sns:eu-west-1:166828921839:45b91098f996f3741ffd565338aaf123",
  "Message": "You have chosen to subscribe to the topic arn:aws:sns:eu-west-1:166828921839:45b91098f996f3741ffd565338aaf123.\nTo confirm the subscription, visit the SubscribeURL included in this message.",
  "SubscribeURL": "https://sns.eu-west-1.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:eu-west-1:166828921839:45b91098f996f3741ffd565338aaf123&Token=2336412f37fb687f5d51e6e2425ba1f25480c7e7646e0393d30ccc84655338dee5e857c6b08e443f75aa976d915691e8b2bbfc7f8eb6a46514cd1a9c1cbe2e4c7f2de792aec925e7da47bfcdbfbe8ddfba0052e3724a712029b7868d5e7b00e98b493350955c8615d4e1a0b9ee8ea0175503678cb0d57dea9aaa0f5792091f4c25d49bc05dad423c12850b9cca60a899",
  "Timestamp": "2024-01-22T12:16:34.309Z",
  "SignatureVersion": "1",
  "Signature": "P+GM5Yi8fzF14oWBmvct+kdAAAER6D6FJpulcXU93XRJnaAjcb7Ap1wBJiNdGlKoAkhTaV1oBen9CIgOB/sQpz76Bd4pjI25xKBu2UNoUsOlHVP0q28e+z26TDZhSi5Jk7K0s7bpauDRsGmrOOY/BFbs1CKrbALy43a8PHT/s5UJcUxWJu/dGrYwBt5Cyt4b2dmwLvA3FvTAE6MQAmrTVr/VNgWWVQ45v55WEpwc6fRjqY9M/G0piSIS3BgUDhQBrQzqKdK5BdYsccnCi3lUfV+TwyLjez6LO+xEndTxuwNMDrta0Y0dDpuY4/v3hV5AuKLAu4VDAkSZmgbBOlA+jI==",
  "SigningCertURL": "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-11eadc530605d63b8e12a526946ef902.pem"
}
```

You will need perform a `GET` request to the `SubscribeURL` to confirm the subscription (or visit it in you web browser).

You will receive a response that looks something like this:

```xml
<ConfirmSubscriptionResponse xmlns="http://sns.amazonaws.com/doc/2010-03-31/">
  <ConfirmSubscriptionResult>
    <SubscriptionArn>arn:aws:sns:eu-west-1:166828921839:45b91098f996f3741ffd565338aaf123:9c5111bd-7cc0-6213-ca4f-e11a0246f956</SubscriptionArn>
  </ConfirmSubscriptionResult>
  <ResponseMetadata>
    <RequestId>5a17c426-cc60-531a-9746-5ae12a8d1311</RequestId>
  </ResponseMetadata>
</ConfirmSubscriptionResponse>
```

Once the subscription is confirmed, you will start to receive notifications.

You can also take a look at the [AWS SNS documentation for this step](https://docs.aws.amazon.com/sns/latest/dg/SendMessageToHttp.confirm.html).

### Message Format

Once confirmed, you'll receive notifications from SNS such as this:

```json
{
  "Type": "Notification",
  "MessageId": "5ea47ac2-a2ed-575d-b4f7-240545727deb",
  "TopicArn": "arn:aws:sns:eu-west-1:367158939173:05b91030f996f3741ffd765338cbf540",
  "Message": "{\n    \"notification\": {\n        \"created\": \"2024-05-22T12:30:23.183Z\",\n        \"params\": {\n            \"type\": \"button\",\n            \"subtype\": \"button\",\n            \"name\": \"SOS Button Press\",\n            \"zones\": [\n                \"Bristol Area\"\n            ],\n            \"message\": \"[Lights on]\"\n        },\n        \"id\": 449515710,\n        \"deviceId\": 2370989,\n        \"pointId\": 1262277892,\n        \"userId\": 3808,\n        \"triggerId\": 488400\n    },\n    \"datapoint\": {\n        \"location\": {\n            \"lat\": 51.4698623,\n            \"lng\": -2.5415884\n        },\n        \"timestamp\": \"2024-05-22T12:30:22.708Z\",\n        \"stringValue\": \"[Lights on]\",\n        \"sendReason\": 1,\n        \"hdop\": -1,\n        \"accuracy\": 20,\n        \"locationType\": \"wifi\",\n        \"batteryVoltage\": 3.771,\n        \"batteryPct\": 33.333333333333336,\n        \"created\": \"2024-05-22T12:30:22.708Z\",\n        \"address\": \"Lightbug, 35-37 Knapps Lane, Bristol, BS5 7UN, United Kingdom\",\n        \"alertType\": 10,\n        \"currentUsed\": 1798,\n        \"gsmSignal\": 28,\n        \"correlationId\": \"75cCLkeK9USMQLURjyEtuT\",\n        \"id\": 1262277892,\n        \"deviceId\": 2370989,\n        \"notifSent\": {\n            \"488400\": true\n        }\n    },\n    \"device\": {\n        \"id\": 2370989,\n        \"imei\": \"869951033863048\"\n    }\n}",
  "Timestamp": "2024-05-22T12:30:23.402Z",
  "SignatureVersion": "1",
  "Signature": "XluL2okkWoW4cyd/6j/F3BJPUW16NXl6x0oVHoQoiiHjWL/uDYNBxRIeqshcxXZWOlP80lsQt3FUErPM0gbiNJuCmzFk1KpxPQg3rBMLf+Rtw5bl6Xut53afLh0y+NJB7KfUdF4sql49UyYmpLhfdGEcZuZt4PpOjoQ/CT3DK4bzIMV3Y8Fa6ntKY24Yq2NVCAIG6TQG1njzoqawU6xR4cFwWnzn9soZSNMwZVPBVqtMO5VMh0ib+WuJVSFzz3grQYhRjIWDI9v/TSG1+ok1ZyFzmE+9iSU9G2+8jFFVpHpkqTvB+LEMcsBhRuT1/OywLCWLhz2+20ngtnLO4jZ+cw==",
  "SigningCertURL": "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-60eadc530605d63b8e62a523676ef735.pem",
  "UnsubscribeURL": "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:367158939173:05b91030f996f3741ffd765338cbf540:9c5935bd-7ce0-4985-ba4f-a88e0246f390"
}
```

Within the `Message` key, you will find the notification data.

 - `notification` contains the notification data, as documented in the V1 API.
 - `datapoint` contains the datapoint data, as documented in the V1 API for the datapoint that triggered the notification.
 - `device` contains the device `id` and `imei` only.

```json
{
    "notification": {
        "created": "2024-01-22T12:30:23.183Z",
        "params": {
            "type": "button",
            "subtype": "button",
            "name": "SOS Button Press",
            "zones": [
                "Bristol Area"
            ],
            "message": "[Lights on]"
        },
        "id": 449515710,
        "deviceId": 2370989,
        "pointId": 1262277892,
        "userId": 3808,
        "triggerId": 488400
    },
    "datapoint": {
        "location": {
            "lat": 51.4698,
            "lng": -2.5415
        },
        "timestamp": "2024-01-22T12:30:22.708Z",
        "stringValue": "[Lights on]",
        "sendReason": 1,
        "hdop": -1,
        "accuracy": 20,
        "locationType": "wifi",
        "batteryVoltage": 3.771,
        "batteryPct": 33.333333333333336,
        "created": "2024-01-22T12:30:22.708Z",
        "address": "45, Some Road, Bristol, BS5 7UN, United Kingdom",
        "alertType": 10,
        "currentUsed": 1798,
        "gsmSignal": 28,
        "correlationId": "75cCLkaK9USKQLUOjyEtuT",
        "id": 1262277892,
        "deviceId": 2370989,
        "notifSent": {
            "488400": true
        }
    },
    "device": {
        "id": 2370989,
        "imei": "869951033863048"
    }
}
```


## Notification Log

Notification Log means that the [Notification tab](/apps/cloud/notifications.html) will log all triggered notifications and alerts.
