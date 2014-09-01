(function() {
  var deepak, fdb;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  module.exports = function(ActiveRecord, activeCounter) {
    var count, db, generateID, start;
    db = this.db;
    start = this.getStartFunction(ActiveRecord);
    generateID = this.getIdGenerator();
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
    return function(tr, counterName, key, callback) {
      if (typeof tr === 'string') {
        callback = key;
        key = counterName;
        counterName = tr;
        tr = null;
      }
      return fdb.future.create((function(_this) {
        return function(futureCb) {
          return start(function(provider) {
            var transactionalIncrement;
            transactionalIncrement = fdb.transactional(count);
            return transactionalIncrement(tr || db, counterName, key, futureCb);
          });
        };
      })(this), callback);
    };
  };

}).call(this);
