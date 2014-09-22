(function() {
  var BatchIterator, Iterator, fdb, options,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  Iterator = require('./');

  options = {
    limit: null,
    streamingMode: fdb.streamingMode.iterator
  };

  module.exports = BatchIterator = (function(_super) {
    __extends(BatchIterator, _super);

    function BatchIterator(db, subspace, key0, key1, func) {
      this.func = func;
      if (typeof key0 === 'function') {
        this.func = key0;
        key0 = null;
      } else if (typeof key1 === 'function') {
        this.func = key1;
        key1 = null;
      }
      BatchIterator.__super__.constructor.call(this, db, subspace, key0, key1);
    }

    BatchIterator.prototype.getOptions = function() {
      return options;
    };

    BatchIterator.prototype.iterate = function(iterator, callback) {
      return iterator.forEachBatch(this.func, callback);
    };

    return BatchIterator;

  })(Iterator);

}).call(this);
