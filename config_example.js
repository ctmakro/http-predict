//备注：请修改config.js，如果config.js不存在，请把此文件复制一份并命名为config.js
//note: please modify config.js. if config.js does not exist, please duplicate this file and rename it as config.js.

var config = {}
module.exports = config

config.port = 3000; //http server

config.tlefile = 'notused'

config.spacetrack={
  identity:'your_spacetrack_account',
  password:'your_password',

  // what data do you want from spacetrack? specify the API address here.
  query:'https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/EPOCH/%3Enow-30/orderby/NORAD_CAT_ID/format/3le' // must be in 3le format.
}

config.arangodb={
  conn:'http://root:@127.0.0.1:8529', //database: ArangoDB
  dbname:'spacetrack'
}
