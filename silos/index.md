---
aside: true
---

# Silos

Lightbug devices communicate with our cloud using a proprietary low power, low data, encrypted protocol.

Typically, we will always recommend you allow us to manage this cloud resource but in some cases organizational requirements prevent this from being an option.

Silos enable enterprise users to run one or more components that make up our IoT platform within their own cloud or on their own hardware.

The current components that can be siloed are:
 - [Ingress](/silos/#ingress)
 - [RTK](/silos/#rtk)

If you were to silo both components, you would have a fully siloed deploymnt, which would look sometthing like this:

![](/images/diagrams/Silo_overview_2023-11-08.excalidraw.svg)

## Pricing

Siloed listeners come at an additional cost either for self-managed, or fully managed deployments.

Silo licenses does not include frontend apps / user interfaces.

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
