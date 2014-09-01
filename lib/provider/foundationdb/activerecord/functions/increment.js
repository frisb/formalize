(function() {
  var deepak, fdb;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  module.exports = function(ActiveRecord, ActiveCounter) {
    var db, increment, start;
    db = this.db;
    start = this.getStartFunction(ActiveRecord);
    increment = function(tr, counter, rec, callback) {
      var inc, k, packedKey, subkey, _i, _len, _ref;
      if (counter.filter(rec)) {
        k = [];
        _ref = counter.key;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subkey = _ref[_i];
          k.push(deepak.pack(rec.data[subkey]));
        }
        packedKey = counter.subspace.pack(k);
        inc = new Buffer(4);
        inc.writeUInt32LE(1, 0);
        tr.add(packedKey, inc);
      }
      return callback(null);
    };
    return function(tr, rec) {
      if (tr instanceof ActiveRecord) {
        rec = tr;
        tr = null;
      }
      return start((function(_this) {
        return function(provider) {
          var callback, transactionalIncrement;
          callback = function() {};
          transactionalIncrement = fdb.transactional(increment);
          return transactionalIncrement(tr || db, _this, rec, callback);
        };
      })(this));
    };
  };

}).call(this);
