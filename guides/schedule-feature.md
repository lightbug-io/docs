---
aside: false
sidebar: false
editLink: false
---

# How to set up the schedule feature

- **Target Audience**: First time users
- **Difficulty**: Easy
- **Prerequisites**: A Lightbug account and access to the mobile app or web portal

::: info
Please note that this is an advanced feature, so if you require any support, please [get in touch](https://lightbug.io/contact/). 
:::

## Guide  
### Schedule Feature 

1. Open the [Lightbug Web Portal](https://lightbug.cloud/)
2. Go to `'Settings'`, then to the `'Schedule'` page  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043310948567-NA9Ortkw7wXdHjcPFr2cST2n21HoM-DnDQ.png){width=250}
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043310948434-sID8eiY38jHiSjU857Yq294Xp4pwb3bkeg.png){width=250}
3. Click on `'ADD RULE'`  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043310979134-MTGn0eiUE_7Iyw1eIJerE4F4h-jx4CXhOw.png){width=250}
4. Enter the `day, time and frequency` that the action will take place  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043310981340-reea4MlxIREjYv45qYQJyoHf5Q8M2tTklA.png){width=250}
5. Select an `action`. Your tracker will perform this action on the selected time  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043310982235-u9f41BcfOHK-4SIZZT-r6dIDd3zv_Vgfxg.png){width=250}
6. Add the `rule`, and create additional rules if required. When finished, `save`  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043311001014-XI8h_qSfQiVfgZSKXgpqB_mVvCxsACCOzA.png){width=250}

**`No Action:`** The tracker will do nothing. This action is here as a placeholder if you want to disable rules without deleting them.  

**`Sleep:`** This will lock the tracker in sleep mode. This means that it will transmit only on beacon interval. You can find and adjust the beacon interval on the `Configuration` page.  

**`Wake:`** This will lock the tracker in `wake mode`. This means that it will transmit on interval. This action is not suited for most use cases as it can drain the battery faster.  

**`Transmit:`** The tracker will send `one update` at the specified `time`. This action does *not* affect any of your tracker's update rate settings.  

::: tip
Rules are evaluated in order.  
:::

### Examples

**`Wednesday 8am Wake, Wednesday 4pm Sleep`** On Wednesday you will receive frequent updates between 8am-4pm. The rest of the time you will receive sleep updates.  

**`All days 9am Transmit now`** You will receive a location update at `9am everyday`. This is in *addition* to any location updates sent due to your trackers settings.

## A Few Things To Note 
Settings are automatically saved and will be applied at the next location update. Alternatively, to apply the new settings immediately, press the button on your tracker for 3 seconds These rules will override motion detection and geofence.

This feature can be a little complicated to set up, so if you have any hesitations, [please reach out to us](https://lightbug.io/contact/).
