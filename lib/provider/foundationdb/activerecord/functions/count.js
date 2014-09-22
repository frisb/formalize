(function() {
  var count, deepak, fdb, transactionalIncrement;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  count = function(tr, counterName, key, callback) {
    var counter, packedKey;
    counter = activeCounter[counterName];
    packedKey = counter.subspace.pack(deepak.packArrayValues(key));
    return tr.get(packedKey, function(err, val) {
      return callback(err, val.readInt32LE(0));
    });
  };

  transactionalIncrement = fdb.transactional(count);

  module.exports = function(ActiveRecord, activeCounter) {
    var db;
    db = this.db;
    return function(tr, counterName, key, callback) {
      if (typeof tr === 'string') {
        callback = key;
        key = counterName;
        counterName = tr;
        return tr = null;
      }
    };
  };

}).call(this);
