---
aside: true
---

# On Premise

Lightbug devices normally communicate with our cloud using a proprietary low power, low data, encrypted protocol.

Typically, we will always recommend you allow us to manage this cloud resource but we recognize that some organizational requirements prevent this from being an option.

Silos are our on premise offering, that enables enterprise users to run one or more components that make up our IoT platform within their own cloud or on their own hardware.

Generally speaking, this is normallly the [Data Ingress](/onprem/#ingress) or [RTK](/onprem/#rtk) services, but sometimes includes custom components. User interfaces are generally not included within the On Premise offering at this time.

## Example

And example Ingress and RTK service deployment might look like this:

![](/images/diagrams/Silo_overview_2023-11-08.excalidraw.svg)

## Pricing

On Premise services currently come at an additional cost, either for self-managed, or fully managed deployments.

Normal per device usage fees still apply.

Current pricing can be found on [our main website](https://lightbug.io/product/custom/#data).

## Ingress

The ingress service handles all device communicaiton and data ingestion for basic devices.

The diagram below shows the basic flow of data in this siloed situation.

![](/images/diagrams/Silo_ingress_overview_2023-11-08.excalidraw.svg)

## RTK

The RTK service is responsible for the management of the RTK data for RTK devices.

The diagram below shows the basic flow of data in this siloed situation.

![](/images/diagrams/Silo_rtk_overview_2023-11-08.excalidraw.svg)

## Terraform

We can provide example terraform code for siloed deployments.
