# Plans

This page describes the shared meaning of Lightbug plan tiers and plan SKUs.

## Base plans

Lightbug offers a variety of plans with different capabilities and features, but they can be broadly categorized into three base plans: Lite, Standard, and Unlimited.

<table cellspacing="0">
  <thead>
    <tr>
      <td></td>
      <td><b>Lite plan</b></td>
      <td><b>Standard plan</b></td>
      <td><b>Unlimited plan</b></td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SKU</td>
      <td><code>LB-DAT-LTE</code></td>
      <td><code>LB-DAT-STD</code></td>
      <td><code>LB-DAT-ULD</code></td>
    </tr>
    <tr>
      <td>Location updates per day</td>
      <td><i class="most">2</i></td>
      <td><i class="most">24</i></td>
      <td><i class="most">Unlimited</i></td>
    </tr>
    <tr>
      <td>Global connectivity</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Motion based tracking <small>& real time sensors (temperature, shock, tilt...)</small></td>
      <td>❌</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Bluetooth sensors <small>Use devices as a mobile data gateway</small></td>
      <td>❌</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Address information <small>Reverse geocoding for all points</small></td>
      <td>❌</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

## Variants

Each base plan has variants with different location update intervals, network restrictions, and RTK capabilities.

These variants are represented by different SKUs via suffix, but share the same core capabilities of their base plan.

Suffixes:

- `6H`, `4H`, `1H`, `15M`, `60S`: location update interval variants.
  - `H` = hours, `M` = minutes, `S` = seconds.
- `MINI`: more restrictive network list.
- `ONLY`: network scope restricted to the specified region (for example `ONLYUK`, `ONLYUS`).

Examples:

- `LB-DAT-STD-4H`: standard plan with 4 hour location update interval.
- `LB-DAT-ULD-ONLYUK`: unlimited plan restricted to UK network coverage.

## RTK

`LB-DAT-ULD-RTK` is an RTK-capable variant of the unlimited plan. It provides the same capabilities as the base unlimited plan, but also allows for additional network usage for RTK corrections to be transmitted.

This is billed separately from the correction data itself.
