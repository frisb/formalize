(function() {
  var BatchQuery, Query, fdb, options,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  Query = require('./');

  options = {
    limit: null,
    streamingMode: fdb.streamingMode.iterator
  };

  module.exports = BatchQuery = (function(_super) {
    __extends(BatchQuery, _super);

    function BatchQuery(db, subspace, key0, key1, func) {
      this.func = func;
      if (typeof key0 === 'function') {
        this.func = key0;
        key0 = null;
      } else if (typeof key1 === 'function') {
        this.func = key1;
        key1 = null;
      }
      BatchQuery.__super__.constructor.call(this, db, subspace, key0, key1);
    }

    BatchQuery.prototype.getOptions = function() {
      return options;
    };

    BatchQuery.prototype.iterate = function(iterator, callback) {
      return iterator.forEachBatch(this.func, callback);
    };

    return BatchQuery;

  })(Query);

}).call(this);
