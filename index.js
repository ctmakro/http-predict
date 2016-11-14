var moment = require('moment');
var config = require('./config.js')

// var backend = require('./backend.js').Backend(config.arangodb.conn,config.arangodb.dbname)

var plibcreator = require('./wrapper.js').PLib_create_fromhash
var getTLE = require('./wrapper.js').getTLE

function getPrediction(darpa,lng,lat){
  var plib = plibcreator(darpa)
  plib.configureGroundStation(lat,lng);
  var passes = plib.getTodaysPasses();
  return passes
}

function humanRep(date){
  if(!date)return undefined;
  var s =  moment(date).format('YYYY-MM-DD HH:mm:ss')
  var zone = moment(date).utcOffset()/60
  return s+ `(${zone})`
}

function passesMapper(passes){
  var output = passes.map(p=>{

    p.dateTimeStartHuman = humanRep(p.dateTimeStart)
    p.dateTimeEndHuman = humanRep(p.dateTimeEnd)
    p.dateTimeHuman = humanRep(p.dateTime)

    var out = ''
    for(key in p){
      var value = p[key]
      if(!value)continue;
      if(value instanceof Date){
        value = value.valueOf()
      }
      out+=key+' : '+value+'\n'
    }
    return out
  }).join('\n')

  return output
}

var express = require('express')
var root = express()

root.set('json spaces',2);
root.enable('trust proxy');

root.use((req,res,next)=>{
  console.log(req.ip,req.method,req.url);
  res.set('Content-Disposition','inline')
  res.type('text/plain')

  req.lng = Number(req.query.lng||0)
  req.lat = Number(req.query.lat||0)
  req.darpa = Number(req.query.num||-1).toString()

  next()
})

root.get('/predict',(req,res,next)=>{
  if(req.darpa==='-1')throw 'NORAD # of the object not specified'
  var passes = getPrediction(req.darpa,req.lng,req.lat)
  var output = passesMapper(passes)
  res.send(output);
})

root.get('/now',(req,res,next)=>{
  if(req.darpa==='-1')throw 'NORAD # of the object not specified'

  var bias = Number(req.query.bias||0) //how are you goin to shift the time?

  var plib = plibcreator(req.darpa)

  plib.configureGroundStation(req.lat,req.lng);
  plib.globalstamp = Date.now() //make stable between calculation

  var current = plib.findAll(bias)
  var somelater = plib.findAll(bias+1000)

  var c = 299792458

  for(i in current){
    var delta = somelater[i].slantRange - current[i].slantRange
    var relspeed = delta * 1000 / 1 // m/s
    current[i].relSpeed = relspeed
    current[i].dopplerFactor = c / (c + relspeed)
  }

  var output = passesMapper(current)

  res.send(output)
})

root.get('/list',(req,res,next)=>{
  if(req.darpa==='-1')throw 'NORAD # of the object not specified'
  var plib = plibcreator(req.darpa)
  var out = passesMapper(plib.listSat())
  res.send(out)
})

root.get('/tle',(req,res,next)=>{
  if(req.darpa==='-1')throw 'NORAD # of the object not specified'
  r = getTLE(req.darpa)
  if(!r) throw 'NORAD # not found in database'
  res.send(r)
})

root.get('/',(req,res)=>{
  res.end(`
    KCSA Real-time Satellite Tracker
    科创航天实时卫星追踪工具

    API:

    /now?num=41845&lng=114&lat=23

    Current direction of the target, given the observer's longitude and latitude.
    已知观察者经度及纬度，求目标当前方向。

    /now?num=41845&lng=114&lat=23&bias=1000

    Same as above but + 1s. bias is in milliseconds
    同上，但预测的是一秒之后。偏置(bias)时间的单位是毫秒

    /predict?num=41845&lng=114&lat=23

    Prediction of passes within a day, given the observer's longitude and latitude.
    已知观察者经度及纬度，预测一天内的过境事件。

    /list?num=41845

    Detailed info of the target.
    指定目标的详细信息。

    /tle?num=41845

    TLE description of the target (for use in other software).
    指定目标的TLE描述文件（用于其他应用程序）。

    'num' parameter is the NORAD # of the target.
    'num' 参数是目标的 NORAD 编号。

    TLEs are acquired from space-track.org and stored in ArangoDB database.
    TLE描述文件是从 space-track.org 获取的，并存储在ArangoDB数据库中。

    Server time and timezone: ${humanRep(Date.now())}
    服务器时间及时区：

    (c)2016 Qin Yongliang / Kechuang Space Association.
    科创航天 覃永良

    Prediction is based on PredictLib from Andrew T. West.
    预测结果基于 Andrew T. West 的 PredictLib 库。

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
    `
  )
})

root.use((err,req,res,next)=>{
  var util = require('util')
  res.type('text/plain')
  res.status(500).end(util.inspect(err));
})

root.listen(config.port,()=>{
  console.log('listening on',config.port);
})
