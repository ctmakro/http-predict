# Real-time Satellite Tracker

  实时卫星追踪工具

# API

[now?num=41845&lng=114&lat=23](now?num=41845&lng=114&lat=23)

Current direction and speed of target, given the observer's longitude and latitude.

已知观察者经度及纬度，求目标当前方位及速度。

[now?num=41845&lng=114&lat=23&bias=1000](now?num=41845&lng=114&lat=23&bias=1000)

Same as above but + 1s. bias is in milliseconds

同上，但预测的是一秒之后。偏置(bias)时间的单位是毫秒

[now?num=41845&lng=114&lat=23&bias=1000&json=true](now?num=41845&lng=114&lat=23&bias=1000&json=true)

Same as above but respond in JSON.

同上，但返回的是JSON格式。

[predict?num=41845&lng=114&lat=23](predict?num=41845&lng=114&lat=23)

Prediction of passes within a day, given the observer's longitude and latitude.

已知观察者经度及纬度，预测一天内的过境事件。

[list?num=41845](list?num=41845)

Detailed info of the target.

指定目标的详细信息。

[tle?num=41845](tle?num=41845)

TLE description of the target (for use in other software).

指定目标的TLE描述文件（用于其他应用程序）。

----

`num` parameter is the NORAD # of the target.

`num` 参数是目标的 NORAD 编号。

TLEs were acquired from space-track.org and stored in `spaceTrackData.json`.

TLE描述文件是从 [space-track.org](//space-track.org) 获取的，并存储在 `spaceTrackData.json` 文件中。

# Repository

Repository: <https://github.com/ctmakro/http-predict>

(c)2016 Qin Yongliang / Kechuang Space Association.

科创航天 覃永良

# PredictLib

Prediction is based on PredictLib from Andrew T. West.

预测结果基于 Andrew T. West 的 PredictLib 库。

```c
/****************************************************************************
*          PredictLib: A satellite tracking/orbital prediction library      *
*                      Copyright Andrew T. West, 2008                       *
*        Based on PREDICT, Copyright John A. Magliacane, KD2BD 1991-2002    *
*                         Last update: 07-Jun-2008                          *
*****************************************************************************
*                                                                           *
* This program is free software; you can redistribute it and/or modify it   *
* under the terms of the GNU General Public License as published by the     *
* Free Software Foundation; either version 2 of the License or any later    *
* version.                                                                  *
*                                                                           *
* This program is distributed in the hope that it will be useful,           *
* but WITHOUT ANY WARRANTY; without even the implied warranty of            *
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU         *
* General Public License for more details.                                  *
*                                                                           *
*****************************************************************************/
```
