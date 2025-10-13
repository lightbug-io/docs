---
order: 5
aside: true
outline: deep
---

<script setup>
import ToitGithubCode from '../../../../../components/ToitGithubCode.vue';
</script>

# Screen bitmaps

Use the `eink` module to display multiple bitmaps on the screen, in a single draw.

## Code

<ToitGithubCode path="examples/modules/eink/element-bitmaps.toit">

```toit
<!-- @include: .vitepress/ext/toit-lightbug/examples/modules/eink/element-bitmaps.toit-->
```

</ToitGithubCode>

### Bitmaps

The bitmaps used, are the Lightbug logo, which are included in the project, as byte arrays.


<ToitGithubCode path="src/util/bitmaps.toit">

```toit
<!-- @include: .vitepress/ext/toit-lightbug/src/util/bitmaps.toit-->
```
</ToitGithubCode>

## Output

```
[jaguar] INFO: program e3e5e232-7e31-0dbc-ce54-d994d415033a started
💬 Sending bitmap logos to device screen
[jaguar] INFO: program e3e5e232-7e31-0dbc-ce54-d994d415033a stopped
```

## Result

You should see four bitmaps drawn, one in each corner.

:::tabs
== Close-up
![](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_YTbhfDXAoC.png){width=500}
:::
