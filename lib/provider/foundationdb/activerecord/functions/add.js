(function() {
  var add, deepak, fdb;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  add = function(tr, rec, value, callback) {
    var counter, inc, k, packedKey, subkey, _i, _j, _len, _len1, _ref, _ref1;
    _ref = rec.counters.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      counter = _ref[_i];
      if (counter.filter(rec)) {
        k = [counter.name];
        _ref1 = counter.key;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          subkey = _ref1[_j];
          k.push(deepak.pack(rec.data[subkey]));
        }
        packedKey = rec.provider.dir.counters.pack(k);
        inc = new Buffer(4);
        inc.writeUInt32LE(1, 0);
        tr.add(packedKey, inc);
      }
    }
    return callback(null);
  };

  module.exports = function(tr, value) {
    var transactionalIncrement;
    if (typeof tr === 'number') {
      value = tr;
      tr = null;
    }
    if (value == null) {
      value = 1;
    }
    transactionalIncrement = fdb.transactional(add);
    return transactionalIncrement(tr || this.provider.db, this, value, function() {});
  };

}).call(this);
