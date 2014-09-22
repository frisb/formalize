(function() {
  var Iterator, deepak, fdb, func, transactionalIterator;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  func = (function(_this) {
    return function(tr, query, callback) {
      var iterator;
      iterator = query.getIterator(tr);
      return query.iterate(iterator, callback);
    };
  })(this);

  transactionalIterator = fdb.transactional(func);

  module.exports = Iterator = (function() {
    function Iterator(provider, subspace, key0, key1) {
      this.provider = provider;
      this.subspace = subspace;
      this.key0 = key0;
      this.key1 = key1;
      if (!this.key0) {
        this.key0 = [];
      }
      this.marker = null;
    }

    Iterator.prototype.getIterator = function(tr) {
      var db, debug, iterator, prefix, r0, r1, rangeType, trType;
      debug = this.provider.debug;
      if (tr) {
        db = tr;
        trType = 'tr';
      } else {
        db = this.provider.db;
        trType = 'db';
      }
      rangeType = this.key1 ? 'getRange' : 'getRangeStartsWith';
      if (!this.key1) {
        if (this.key0 == null) {
          this.key0 = [];
        }
        debug.buffer('prefix', this.key0, deepak.unpackArrayValues, deepak);
        prefix = this.subspace.pack(this.key0);
        iterator = db.getRangeStartsWith(prefix, this.getOptions());
      } else {
        if (this.marker !== null) {
          debug.buffer('marker', this.marker, deepak.unpackArrayValues, deepak);
        } else {
          debug.buffer('key0', this.key0, deepak.unpackArrayValues, deepak);
        }
        debug.buffer('key1', this.key1, deepak.unpackArrayValues, deepak);
        r0 = this.subspace.range(this.marker || this.key0);
        r1 = this.subspace.range(this.key1);
        iterator = db.getRange(r0.begin, r1.end, this.getOptions());
      }
      debug.log('Iterator', "" + trType + "." + rangeType + "()");
      return iterator;
    };

    Iterator.prototype.iterate = function(iterator, callback) {
      throw new Error('not implemented');
    };

    Iterator.prototype.getOptions = function() {
      throw new Error('not implemented');
    };

    Iterator.prototype.execute = function(tr, callback) {
      if (typeof tr === 'function') {
        callback = tr;
        tr = null;
      }
      return transactionalIterator(tr || this.provider.db, this, callback);
    };

    return Iterator;

  })();

}).call(this);
