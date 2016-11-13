var request = require('request')
var config = require('./config.js')
var backend = require('./backend.js').Backend(config.arangodb.conn,config.arangodb.dbname)

backend.newCollection('tles')

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
  query:'https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/EPOCH/%3Enow-30/orderby/NORAD_CAT_ID/format/3le'
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
  return backend.AQL(`
    for i in @records
    upsert {_key:i._key}
    insert i
    update i in tles
    `,{records}
  )
})
.catch(console.error)
