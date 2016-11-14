var fs = require('fs')

var datafile = './spaceTrackData.json'

console.log('loading from',datafile);
var map = JSON.parse(fs.readFileSync(datafile,{encoding:'utf8',flag:'r'}))

console.log('hashmap loaded.');

module.exports = key=>map[key]
module.exports.hashmap = map
