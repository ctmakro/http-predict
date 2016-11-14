var fs = require('fs')

var datafile = './spaceTrackData.json'

console.log('loading from',datafile);
var data = JSON.parse(fs.readFileSync(datafile,{encoding:'utf8',flag:'r'}))
console.log('loaded. inserting hashmap...');
var map = {}

data.map(d=>{
  map[d._key] = d.text
})

console.log('hashmap done.');

module.exports = key=>map[key]
