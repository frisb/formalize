(function() {
  var count, deepak, fdb, transactionalIncrement;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  count = function(tr, counterName, key, callback) {
    var counter, k, packedKey, subkey, _i, _len;
    counter = activeCounter[counterName];
    k = [];
    for (_i = 0, _len = key.length; _i < _len; _i++) {
      subkey = key[_i];
      k.push(deepak.pack(subkey));
    }
    packedKey = counter.subspace.pack(k);
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
