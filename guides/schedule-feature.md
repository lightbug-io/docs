---
aside: false
sidebar: false
editLink: false
---

# How to set up the schedule feature

**`Target Audience:`** Experienced users  
**`Difficulty:`** Moderate  
**`Prerequisites:`** A Lightbug account and access to the mobile app or web portal  

::: info
Please note that this is an advanced feature, so if you require any support, please [get in touch](https://lightbug.io/contact/). 
:::

## Guide  
::: tabs
== Desktop
### Schedule Feature 
1. Open the [Lightbug Web Portal](https://lightbug.cloud/)
2. Go to `'Settings'`, then to the `'Schedule'` page  
![](https://upload.r2.lb.chasm.cloud/2026/11/schedule-feature/Desktop-1-ae3e5b07-a6d7-452c-b9ea-39dca766f26f.png)  
![](https://upload.r2.lb.chasm.cloud/2026/11/schedule-feature/Desktop-2-b60a7565-262d-426c-a795-9fc18b5f40d6.png)
3. Click on `'ADD RULE'`  
![](https://upload.r2.lb.chasm.cloud/2026/11/schedule-feature/Desktop-3-ad0e64cb-cb47-4bbf-8278-2cb9890bb811.png)
4. Enter the `day and time` that the action will take place  
![](https://upload.r2.lb.chasm.cloud/2026/11/schedule-feature/Desktop-4-3f1e47c2-65ef-4cd2-87a9-5a6f2f4f1083.png)
5. Select an `action`. Your tracker will perform this action at the selected time  
![](https://upload.r2.lb.chasm.cloud/2026/11/schedule-feature/Desktop-5-fc35bb31-2835-4881-83c4-61cf5c389e32.png)
6. Create additional rules if required. When finished, click `save`  
![](https://upload.r2.lb.chasm.cloud/2026/11/schedule-feature/Desktop-6-97fc5ecf-9623-4ebc-b85b-27f671546fa0.png)  
== Mobile
### Schedule Feature 
1. Open the Lightbug Mobile App
2. Go to `'Settings'`, then to the `'Schedule'` page  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043310948567-NA9Ortkw7wXdHjcPFr2cST2n21HoM-DnDQ.png)  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043310948434-sID8eiY38jHiSjU857Yq294Xp4pwb3bkeg.png)
3. Click on `'ADD RULE'`  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043310979134-MTGn0eiUE_7Iyw1eIJerE4F4h-jx4CXhOw.png)
4. Enter the `day and time` that the action will take place  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043310981340-reea4MlxIREjYv45qYQJyoHf5Q8M2tTklA.png)
5. Select an `action`. Your tracker will perform this action at the selected time  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043310982235-u9f41BcfOHK-4SIZZT-r6dIDd3zv_Vgfxg.png)
6. Create additional rules if required. When finished, `save`  
![](https://upload.r2.lb.chasm.cloud/2026/10/docs-guides-fresh-grab/2043311001014-XI8h_qSfQiVfgZSKXgpqB_mVvCxsACCOzA.png)
:::
## Actions  
**`No Action:`** The tracker will do nothing. This action is here as a placeholder if you want to disable rules without deleting them.  

**`Sleep:`** This will lock the tracker in sleep mode. This means that it will transmit only on beacon interval. You can find and adjust the beacon interval on the `Configuration` page.  

**`Wake:`** This will lock the tracker in `wake mode`. This means that it will transmit on interval. This action is not suited for most use cases as it can drain the battery faster.  

**`Transmit:`** The tracker will send `one update` at the specified `time`. This action does *not* affect any of your tracker's update rate settings. 
## Examples  
**`Wednesday 8am Wake, Wednesday 4pm Sleep`**  
On Wednesday you will receive frequent updates between 8am-4pm. The rest of the time you will receive sleep updates.  

**`All days 9am Transmit now`**  
You will receive a location update at `9am everyday`. This is in *addition* to any location updates sent due to your trackers settings.  
::: tip
Rules are evaluated in order.  
:::
::: info 
Settings are automatically saved and will be applied at the next location update. Alternatively, to apply the new settings immediately, press the button on your tracker for 3 seconds These rules will override motion detection and geofence.
:::

This feature can be a little complicated to set up, so if you have any hesitations, [please reach out to us](https://lightbug.io/contact/).
