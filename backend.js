var Backend = (uri,dbname,logger)=>{

  var backend = {}
  var log = logger||console.log

  var db = require('arangojs')(uri);
  db.useDatabase(dbname);

  backend.db = db

  backend.newCollection = name=>{
    return db.collection(name).create()
  }

  backend.createIndex = (coll,details)=>{
    var def = {
      type:'skiplist',
      unique:false,
      sparse:false,
    }
    Object.assign(def,details)
    return db.collection(coll).createIndex(def)
    .then(res=>{
      log(`index ${def.fields} created on ${coll}`)
      return res
    })
  }

  backend.dropCollection = collection_name=>{
    return db.collection(collection_name).drop()
  }

  backend.importCollection = (collname,docarray)=>{
    return db.collection(collname).import(docarray)
  }

  function aqlall(aqlobj){
    return db.query(aqlobj.query,aqlobj.params) //returns a Promise
    .then(cursor=>{
      return cursor.all();
    })
  };

  var AQL = function(querystring,parameter){
    return aqlall({query:querystring,params:parameter||{}});
  }

  backend.AQL = AQL

  backend.transact = function(qs,bv,read,write){
    var action = String(function () {
      // This code will be executed inside ArangoDB!
      var db = require('@arangodb').db;
      return db._query(params.qs,params.bv).toArray();
    })

    return db.transaction({read,write}, action, {qs,bv})
  }

  return backend
}

module.exports = {Backend}
