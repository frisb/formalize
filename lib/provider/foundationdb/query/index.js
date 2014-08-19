(function() {
  var fdb;

  fdb = require('fdb').apiVersion(200);

  module.exports = function(db) {
    var Query;
    return Query = (function() {
      function Query(subspace, key0, key1) {
        this.subspace = subspace;
        this.key0 = key0;
        this.key1 = key1;
      }

      Query.prototype.iterate = function(iterator, callback) {
        throw new Error('not implemented');
      };

      Query.prototype.getOptions = function() {
        throw new Error('not implemented');
      };

      Query.prototype.execute = function(tr0, callback) {
        var transaction;
        transaction = (function(_this) {
          return function(tr, innerCallback) {
            var iterator, r0, r1;
            r0 = _this.subspace.range(_this.key0);
            r1 = _this.subspace.range(_this.key1);
            iterator = tr.getRange(r0.begin, r1.end, _this.getOptions());
            return _this.iterate(iterator, innerCallback);
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

      return Query;

    })();
  };

}).call(this);
