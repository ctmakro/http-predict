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


function colonStyle(p){
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
}

function passesMapper(passes,asjson){
  var output = passes.map(p=>{

    p.dateTimeStartHuman = humanRep(p.dateTimeStart)
    p.dateTimeEndHuman = humanRep(p.dateTimeEnd)
    p.dateTimeHuman = humanRep(p.dateTime)

    return p
  })

  if(asjson){
    output = JSON.stringify(output);
  }else{
    output = output.map(colonStyle).join('\n')
  }
  return output
}

var express = require('express')
var root = express()

root.set('json spaces',2);
root.enable('trust proxy');

root.use((req,res,next)=>{
  console.log(req.ip,req.method,req.url);
  res.set('Content-Disposition','inline')

  if(req.query.json){
    res.type('json')
    req.outputJSON = true
  }else{
    res.type('text/plain')
  }

  req.lng = Number(req.query.lng||0)
  req.lat = Number(req.query.lat||0)
  req.darpa = Number(req.query.num||-1).toString()

  next()
})

root.get('/predict',(req,res,next)=>{
  if(req.darpa==='-1')throw 'NORAD # of the object not specified'
  var passes = getPrediction(req.darpa,req.lng,req.lat)

  res.passes = passes;
  next()
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

  res.passes = current;
  next();
})

root.get('/list',(req,res,next)=>{
  if(req.darpa==='-1')throw 'NORAD # of the object not specified'
  var plib = plibcreator(req.darpa)
  res.passes = plib.listSat()
  next();
})

root.use((req,res,next)=>{
  if(res.passes){
    var out = passesMapper(res.passes,req.outputJSON)
    res.send(out)
  }else{
    //throw 'what?'
    next()
  }
})

root.get('/tle',(req,res,next)=>{
  if(req.darpa==='-1')throw 'NORAD # of the object not specified'
  r = getTLE(req.darpa)
  if(!r) throw 'NORAD # not found in database'
  res.send(r)
})

var jade = require('jade')
var cm = require('commonmark')
var cr = new cm.Parser();
var cw = new cm.HtmlRenderer({
  sourcepos:true,
  pretty:true,
  cache:false,
});
jade.filters.markdown = md=>cw.render(cr.parse(md))

root.get('/',(req,res)=>{
  res.type('text/html')
  res.send(jade.renderFile('index.jade',{
    humanRep
  }))
})

root.use((err,req,res,next)=>{
  var util = require('util')
  res.type('text/plain')
  res.status(500).end(util.inspect(err));
})

root.listen(config.port,()=>{
  console.log('listening on',config.port);
})
