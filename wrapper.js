var fs = require('fs')
var config = require('./config.js')

//var backend = require('./backend.js').Backend(config.arangodb.conn,config.arangodb.dbname)

// predictlib is not written as a module for node.
// therefore we have to load and evaluate it differently
var PLib_code = fs.readFileSync('./andrewtwest-orbtrak/predictlib.js')

// code within the following function will be
// appended to original predictlib.js before evaluation
var postfix = (function(){

  //implemented for ease of operation
  PLib.findAll = function(bias){
    var all = []
    for (z in PLib.sat)
    {
      var satInfo = {};

      PLib.daynum = PLib.CurrentDaynum(bias);
      PLib.PreCalc(z);
      PLib.Calc();

      if (PLib.Decayed(z, PLib.daynum) == 0){
        satInfo.dateTime = PLib.Daynum2Date(PLib.daynum);
        satInfo.elevation = PLib.iel;
        satInfo.azimuth = PLib.iaz;
        satInfo.orbitalPhase = PLib.ma256;
        satInfo.latitude = PLib.isplat;

        var lng = 360 - PLib.isplong;
        if (lng > 180) lng = -PLib.isplong;
        satInfo.longitude = lng;

        satInfo.slantRange = PLib.irk;
        satInfo.orbitNumber = PLib.rv;
        satInfo.visibility = PLib.findsun;

        satInfo.name = PLib.sat[z].name
      }
      all.push(satInfo);
    }
    return all;
  }

  PLib.listSat = function(){
    return PLib.sat.map(n=>{n.line1=undefined;n.line2=undefined;return n})
  }

  return PLib;
}).toString()

// post processing
postfix = postfix.slice(postfix.indexOf("{") + 1, postfix.lastIndexOf("}"))
// append
PLib_code += postfix
// evaluate
var PLib = new Function(PLib_code);

//load tle from file
function loadTLE(path){
  var tlefile = fs.readFileSync(path,{encoding:'utf8',flag:'r'})

  var tledata = []
  var tlelines = tlefile.split('\n').map(l=>l.trim())

  for (var i = 0; i < tlelines.length; i+=3) {
    if(tlelines[i].length>0)
    tledata.push([
      tlelines[i],tlelines[i+1],tlelines[i+2]
    ])
  }
  return tledata
}

var hashmapper = require('./hashmap.js')

module.exports.getTLE = num=>hashmapper(num)

// create a plib instance, by loading TLE from hashtable
module.exports.PLib_create_fromhash = (darpa)=>{
  var plib = PLib();

  var text = hashmapper(darpa)
  if(!text)throw 'NORAD # not found'

  var lines = text.split('\n')

  plib.tleData = [[lines[0],lines[1],lines[2]]]
  plib.InitializeData();

  return plib;
}

//create a plib instance by loading TLE from file
module.exports.PLib_create = (tlepath)=>{
  var plib = PLib();

  var tledata = loadTLE(tlepath)

  console.log('loaded',tledata.length,'records from',tlepath);
  console.dir(tledata)

  plib.tleData = tledata;
  plib.InitializeData();

  return plib;
}
