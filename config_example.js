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
