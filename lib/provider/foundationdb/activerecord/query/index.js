(function() {
  var fdb, func;

  fdb = require('fdb').apiVersion(200);

  func = (function(_this) {
    return function(db, query, callback) {
      var iterator, prefix, r0, r1;
      if (!query.key1) {
        prefix = query.subspace.pack([]);
        iterator = db.getRangeStartsWith(prefix, query.getOptions());
      } else {
        r0 = query.subspace.range(query.key0);
        r1 = query.subspace.range(query.key1);
        iterator = db.getRange(r0.begin, r1.end, query.getOptions());
      }
      return query.iterate(iterator, callback);
    };
  })(this);

  module.exports = function(db) {
    var Query;
    return Query = (function() {
      function Query(subspace, key0, key1) {
        this.subspace = subspace;
        this.key0 = key0;
        this.key1 = key1;
        if (!this.key0) {
          this.key0 = [];
        }
      }

      Query.prototype.iterate = function(iterator, callback) {
        throw new Error('not implemented');
      };

      Query.prototype.getOptions = function() {
        throw new Error('not implemented');
      };

      Query.prototype.execute = function(tr, callback) {
        var transactionalQuery;
        if (typeof tr === 'function') {
          callback = tr;
          tr = null;
        }
        transactionalQuery = fdb.transactional(func);
        return transactionalQuery(tr || db, this, callback);
      };

      return Query;

    })();
  };

}).call(this);
