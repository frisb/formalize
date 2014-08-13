(function() {
  var fdb, utils;

  fdb = require('fdb').apiVersion(200);

  utils = require('../utils');

  module.exports = function(ActiveRecord) {
    var db, schema, subspace;
    subspace = this.getSubspace(ActiveRecord);
    schema = ActiveRecord.prototype.schema;
    db = this.db;
    return function(tr0, callback) {
      var transaction;
      if (typeof tr0 === 'function') {
        callback = tr0;
        tr0 = null;
      }
      transaction = (function(_this) {
        return function(tr, innerCallback) {
          var d, val, _i, _len, _ref;
          tr.set(subspace.pack([_this.id]), utils.pack(''));
          _ref = schema.dest;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            d = _ref[_i];
            val = _this.attributes[d];
            tr.set(subspace.pack([_this.id, d]), utils.pack(val));
          }
          _this.isNew = false;
          return innerCallback();
        };
      })(this);
      if (tr0) {
        return fdb.future.create(function(futureCb) {
          return transaction(tr0, futureCb);
        }, callback);
      } else {
        return db.doTransaction(transaction, callback);
      }
    };
  };

}).call(this);
