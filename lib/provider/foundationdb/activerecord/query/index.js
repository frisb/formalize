(function() {
  var Query, fdb, func, transactionalQuery;

  fdb = require('fdb').apiVersion(200);

  func = (function(_this) {
    return function(tr, query, callback) {
      var iterator;
      iterator = query.getIterator(tr);
      return query.iterate(iterator, callback);
    };
  })(this);

  transactionalQuery = fdb.transactional(func);

  module.exports = Query = (function() {
    function Query(db, subspace, key0, key1) {
      this.db = db;
      this.subspace = subspace;
      this.key0 = key0;
      this.key1 = key1;
      if (!this.key0) {
        this.key0 = [];
      }
    }

    Query.prototype.getIterator = function(tr) {
      var db, prefix, r0, r1;
      db = tr || this.db;
      if (!this.key1) {
        prefix = this.subspace.pack([]);
        return db.getRangeStartsWith(prefix, this.getOptions());
      } else {
        r0 = this.subspace.range(this.key0);
        r1 = this.subspace.range(this.key1);
        return db.getRange(r0.begin, r1.end, this.getOptions());
      }
    };

    Query.prototype.iterate = function(iterator, callback) {
      throw new Error('not implemented');
    };

    Query.prototype.getOptions = function() {
      throw new Error('not implemented');
    };

    Query.prototype.execute = function(tr, callback) {
      if (typeof tr === 'function') {
        callback = tr;
        tr = null;
      }
      if (tr === null) {
        return fdb.future.create((function(_this) {
          return function(futureCb) {
            var innerFuture;
            innerFuture = _this.getIterator();
            return innerFuture(futureCb);
          };
        })(this), callback);
      } else {
        return transactionalQuery(tr || this.db, this, callback);
      }
    };

    return Query;

  })();

}).call(this);
