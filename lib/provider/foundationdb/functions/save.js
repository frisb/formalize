(function() {
  var createTransaction, fdb, utils;

  fdb = require('fdb').apiVersion(200);

  utils = require('../utils');

  createTransaction = function(rec) {
    return function(tr, innerCallback) {
      var d, val, _i, _len, _ref;
      console.log('test');
      if (!rec.id) {
        rec.id = generateID();
      }
      console.log('test2');
      tr.set(provider.dir.records.pack([rec.id]), utils.pack(''));
      _ref = rec.schema.dest;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d !== 'id') {
          val = rec.data[d];
          tr.set(provider.dir.records.pack([rec.id, d]), utils.pack(val));
        }
      }
      rec.isNew = false;
      rec.isLoaded = true;
      rec.changed = [];
      return innerCallback(null, rec);
    };
  };

  module.exports = function(ActiveRecord) {
    var db, generateID, provide;
    db = this.db;
    provide = this.getProviderFunction(ActiveRecord);
    generateID = this.getIdGenerator();
    return function(tr, callback) {
      var transaction;
      if (typeof tr === 'function') {
        callback = tr;
        tr = null;
      }
      transaction = createTransaction(this);
      return provide(function(provider) {
        if (tr) {
          return fdb.future.create(function(futureCb) {
            return transaction(tr, futureCb);
          }, callback);
        } else {
          return db.doTransaction(transaction, callback);
        }
      });
    };
  };

}).call(this);
