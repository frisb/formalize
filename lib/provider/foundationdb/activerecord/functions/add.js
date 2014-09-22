(function() {
  var add, deepak, fdb, transactionalAdd;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  add = function(tr, rec, mechanism, value, callback) {
    var data, directory, item, k, packedKey, subkey, _i, _j, _len, _len1, _ref, _ref1;
    _ref = rec[mechanism].items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      directory = rec.provider.dir[mechanism][item.name];
      if (!item.filter || item.filter(rec)) {
        k = [];
        _ref1 = item.key;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          subkey = _ref1[_j];
          if (typeof subkey === 'function') {
            data = subkey(rec);
          } else {
            data = rec.data(subkey);
          }
          k.push(deepak.packValue(data));
        }
        packedKey = directory.pack(k);
        if (mechanism === 'counters') {
          tr.add(packedKey, value);
        } else {
          tr.set(packedKey, value);
        }
      }
    }
    return callback(null);
  };

  transactionalAdd = fdb.transactional(add);

  module.exports = function(mechanism) {
    return function(tr, value) {
      return transactionalAdd(tr || this.provider.db, this, mechanism, value, function() {});
    };
  };

}).call(this);
