(function() {
  var fdb, utils;

  fdb = require('fdb').apiVersion(200);

  utils = require('../utils');

  module.exports = function(ActiveRecord) {
    var db, generateID, provide, save;
    db = this.db;
    provide = this.getProviderFunction(ActiveRecord);
    generateID = this.getIdGenerator();
    save = function(tr, provider, rec, callback) {
      var counter, d, inc, key, packedKey, subkey, subspace, val, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      if (!rec.id) {
        rec.id = generateID();
      }
      tr.set(provider.dir.records.pack([rec.id]), utils.pack(''));
      _ref = rec.schema.dest;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d !== 'id') {
          val = rec.data[d];
          tr.set(provider.dir.records.pack([rec.id, d]), utils.pack(val));
        }
        rec.isNew = false;
        rec.isLoaded = true;
        rec.changed = [];
      }
      _ref1 = rec.counters;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        counter = _ref1[_j];
        if (counter.filter(rec)) {
          console.log(counter.name);
          subspace = provider.dir.counters.subspace([counter.name]);
          key = [];
          _ref2 = counter.key;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            subkey = _ref2[_k];
            key.push(utils.pack(rec.data[subkey]));
          }
          packedKey = subspace.pack(key);
          inc = new Buffer(4);
          inc.writeUInt32LE(1, 0);
          tr.add(packedKey, inc);
        }
      }
      return callback(null);
    };
    return function(tr, callback) {
      if (typeof tr === 'function') {
        callback = tr;
        tr = null;
      }
      return fdb.future.create((function(_this) {
        return function(futureCb) {
          var provideCallback;
          provideCallback = function(provider) {
            var transactionalSave;
            transactionalSave = fdb.transactional(save);
            return transactionalSave(tr || db, provider, _this, futureCb);
          };
          return provide(provideCallback);
        };
      })(this), callback);
    };
  };

}).call(this);
