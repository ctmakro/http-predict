var config = {}
module.exports = config

config.port = 3000; //http server

config.tlefile = 'notused'

config.spacetrack={
  identity:'your_spacetrack_account',
  password:'your_password',
}

config.arangodb={
  conn:'http://root:@127.0.0.1:8529', //database: ArangoDB
  dbname:'spacetrack'
}
