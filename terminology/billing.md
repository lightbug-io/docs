# Billing

All devices are individually billed on a monthly basis at the start of each month.

## Payment methods

- Pre pay with auto bill: You pay for plans in advance of using them, and have billing details set up.
- Pre pay: You pay for plans in advance of using them, but do not have billing details set up. If you do not correctly populate your plan pool, and control devices, devices may be deactivated.
- Post pay: You pay for plans after using them, and have a billing account set up with us. This is typically used by businesses, and provides maximum flexibility, and an invoice at the end of each month. Only larger accounts are eligible for post pay, and you must contact us to set up a post pay account.

## Plan pool

All accounts have a pool of plan credits.

When devices are activated, or when the monthly billing cycle occurs, the device will consume plan credits from the pool of the owner of the device.

If no credits are available of the required type, one of the below options will occur:
- The plan will be purchased automatically, and added to the pool, if the account is pre pay and has billing details set up.
- The plan will be automatically allocated, and billed in the next invoice, if the account is post pay and the device is on the post pay account.
- The device will be deactivated, if the account is pre pay and has no billing details set up, and no remaining plan credits are available.

This pool is shared between all devices on the account.

### Bundled plans

Some products, such as retail bundles, come with one or more plan credits bundled with the product.

When an order is placed, the plan credits will be added to the pool of the user that placed the order.

:::warning
Allocation of the plan credits will be done manually, and you may need to reach out to support to have the plan credits added to your account if they appear missing.
:::

### Bulk purchasing

Plan credits can be purchased in bulk, at a discount via a [sales enquiry](https://lightbug.io/contact/).

Plans purchased this way will be added to the pool of the user that purchased the plans.

## Initial activation

When a device is activated, it will consume a plan credit from the pool, or you will be prompted to purchase a plan credit.

- Pre Pay: If the activation happens during the billing cycle, a full month's plan will be consumed, and you'll be credited for the remaining days of the month in your next invoice.
- Post Pay: A full plan will be allocated, and partially billed in the next invoice, based on the number of days used in the month (with a minimum spend also applied).

## Billing cycle

The billing cycle is fixed to the start of each month.

- Pre Pay:
  - Any plans purchased mid month will be allocated in full, and you will be credited for the remaining days or amount in the next billing invoice.
  - If credits are not used within an invoice, they will be shown, but applied in a future invoice.

## Plan changes

Upgrades and downgrades of plans can be done at any time.

- Pre Pay:
   - If you upgrade a plan, you will be credited for the remaining days of the month of your previous plan in the next invoice, and a plan will be consumed from the pool for the new plan, or purchased.
   - If you downgrade a plan, a plan will be consumed from the pool for the new plan, or purchased.
   - If you cancel a plan, you will not be credited for the remaining days of the month.
- Post Pay:
   - If you upgrade, downgrade, or cancel a plan, you will be billed for the partial days used (with a minimum spend also applied) in the next invoice.

## Calculations

### Pre Pay

See [Initial activation](#initial-activation) and [Plan changes](#plan-changes) for how pre pay billing is calculated.

### Post Pay

For post pay and other post pay billing, invoice line items are calculated from the individual plan allocations used during the billing month, then grouped by SKU on the invoice.

#### How the quantity is calculated

The quantity shown on a post pay invoice is the sum of the partial month usage for all allocations of that SKU during the billing month.

- Usage is prorated by the number of calendar days used in the billing month. (For example, April is divided by 30 days, while May is divided by 31 days)
- Days are counted inclusively, so an allocation that starts and ends on the same calendar day still counts as 1 day of usage.

For example, if a plan is active for 15 days in a 30 day month, it contributes 0.5 to the invoice quantity for that SKU.

#### How the price is chosen

For post pay plans, the unit price is selected from the default pricing bands, and any custom pricing bands that may be set up for the account.

This is based on the total quantity of that SKU used in the billing month, and the price bands that are set up for that SKU.

Once the correct price band has been selected, that unit price is applied to each SKU's prorated quantity on the invoice.

#### Why the same device can appear multiple times

Billing is based on plan allocations, not only on unique devices.

This means a device can contribute multiple billed entries within the same month if it is:

- activated part way through the month
- upgraded or downgraded
- moved between plans more than once
- deactivated and reactivated

In these cases, each allocation records its own consumed and removed dates, and each contributes its own prorated amount to the monthly invoice.

## Examples

### 1. Pre Pay: One renewing, one new device, no billing

Two devices renew at the end of the month, making use of a pool that has 4 plan credits for the unlimited plan, resulting in 2 plan credits being left, and no billing occurring.

Device A was activated the previous month and made use of a whole plan month this month.
Device B was activated part way through the current month, and needs some credit applied to the invoice.

78% of device Bs plan was used (based on whole days of usage), leaving 22% of the plan to be credited back to the account.

Assuming a price of $13 for 1 month of the unlimited plan, the invoice was credited $2.86, which covers this 22%.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/sKw7mQ7.png){.center}{width=600}

### 2. Post Pay

A post pay account with 135 devices, with the following plan usage:

- 6 devices using lite plans, which were activated for the whole month.
- 126 devices using standard plans, a few of which were activated part way through the month.
- 3 devices using unlimited plans, most of which were activated toward the end of the month.

The invoice for the month would summarize this information, and show the total amount due for the month.

Any additional information about which plans were used by which devices, and when they were activated, is available in the plans section of the admin portal.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/aEESGKE.png){.center}{width=600}

### 3. Post Pay: Multiple activation periods

<!-- This example is based on a single device, which is activated for a period of 5 days, and then a period of 10 days in a 30 day month. -->

A device is activated for 5 days, then deactivated for 10 days, then reactivated for 10 days in a 30 day month.


- Activation 1: On Day 1 of the month, a month plan is consumed by the device.
- Deactivation: On Day 5 of the month, the device is deactivated, the same month plan is marked as removed.
- Activation 2: On Day 15 of the month, a month plan is consumed by the device again (This is a new plan, and allocation, separate from the first activation).
- Deactivation: On Day 25 of the month, the device is deactivated again, and the second month plan is marked as removed.

This results in 15 days of usage, which contributes 0.5 to the invoice quantity for that SKU.

The invoice would show a quantity of 0.5 for that SKU, and the unit price would be selected based on the total quantity of that SKU used in the billing month, and the price bands that are set up for that SKU.
