var moment = require('moment');
var config = require('./config.js')
var backend = require('./backend.js').Backend(config.arangodb.conn,config.arangodb.dbname)

var plibcreator = require('./wrapper.js').PLib_create_fromDB

function getPrediction(darpa,lng,lat){
  return plibcreator(darpa)
  .then(plib=>{
    plib.configureGroundStation(lat,lng);
    var passes = plib.getTodaysPasses();
    return passes
  })
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
  getPrediction(req.darpa,req.lng,req.lat)
  .then(passes=>{
    var output = passesMapper(passes)

    res.send(output);
  })
  .catch(next)
})

root.get('/now',(req,res,next)=>{
  if(req.darpa==='-1')throw 'NORAD # of the object not specified'
  plibcreator(req.darpa)
  .then(plib=>{
    plib.configureGroundStation(req.lat,req.lng);
    var output = passesMapper(plib.findAll())

    res.send(output)
  })
  .catch(next)
})

root.get('/list',(req,res,next)=>{
  if(req.darpa==='-1')throw 'NORAD # of the object not specified'
  plibcreator(req.darpa)
  .then(plib=>{

    var out = passesMapper(plib.listSat())
    res.send(out)
  })
  .catch(next)
})

root.get('/',(req,res)=>{
  res.end(`
    KCSA Real-time Satellite Tracker

    API:

    /now?num=41845&lng=114&lat=23
    Current direction of the target, given the observer's longitude and latitude.

    /predict?num=41845&lng=114&lat=23
    Prediction of passes within a day, given the observer's longitude and latitude.

    /list?num=41845
    Detailed info of the target.

    'num' is the NORAD # of the target.
    TLEs are acquired from space-track.org and stored in our database.

    Server time and timezone: ${humanRep(Date.now())}

    (c)2016 Qin Yongliang, Kechuang Space Association.

    prediction is based on PredictLib from Andrew T. West.

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

root.listen(config.port)
