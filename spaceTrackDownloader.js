var request = require('request')
var fs = require('fs')
var config = require('./config.js')
// var backend = require('./backend.js').Backend(config.arangodb.conn,config.arangodb.dbname)
//
// backend.newCollection('tles')

var post = (url,form)=>{
  console.log('requesting',url);
  return new Promise((resolve,reject)=>{
    request.post({url,form}, function(err,httpResponse,body){
      if(err)return reject(err);

      resolve({
        res:httpResponse,
        body
      })
    })
  })
}

post('https://www.space-track.org/ajaxauth/login',{
  identity:config.spacetrack.identity,
  password:config.spacetrack.password,
  query:config.spacetrack.query,
})
.then(res=>{
  console.log('request done');
  var map = {}

  var records = res.body.slice(2).split('\r\n0 ')
  .map(text=>{
    map[Number(text.split('\r\n2 ')[1].slice(0,5)).toString()] = text.trim()
  })

  console.log('mapping done');
  //console.dir(records)

  // return backend.AQL(`
  //   for i in @records
  //   upsert {_key:i._key}
  //   insert i
  //   update i in tles
  //   `,{records}
  // )


  // i mean, why store them in database? 50000 record would fit directly in memory. damn.

  // 1. check if hashmap file exists
  try{
    console.log('trying to load existing hashmap...');
    var hm = require('./hashmap.js')
  }catch(err){
    // if notexist
    console.log('load failed');
    console.log('writing directly to ./spaceTrackData.json...');
    fs.writeFileSync('./spaceTrackData.json',JSON.stringify(map))
    console.log('done.');
    return;
  }

  // if exist

  // merge both hashmap
  Object.assign(map,hm.hashmap);
  console.log('load success. merging with original hashmap...');
  console.log('writing to ./spaceTrackData.json...');
  fs.writeFileSync('./spaceTrackData.json',JSON.stringify(map))
  console.log('done.');
})
.catch(console.error)
