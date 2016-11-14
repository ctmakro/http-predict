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
  var records = res.body.slice(2).split('\r\n0 ')
  .map(text=>{
    return {
      _key:Number(text.split('\r\n2 ')[1].slice(0,5)).toString(),
      text:text.trim(),
    }
  })
  console.log('slicing done');
  //console.dir(records)

  // return backend.AQL(`
  //   for i in @records
  //   upsert {_key:i._key}
  //   insert i
  //   update i in tles
  //   `,{records}
  // )


  // i mean, why store them in database? 50000 record would fit directly in memory. damn.

  console.log('writing to file...');
  fs.writeFileSync('./spaceTrackData.json',JSON.stringify(records))
})
.catch(console.error)
