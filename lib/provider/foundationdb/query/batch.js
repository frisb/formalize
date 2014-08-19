(function() {
  var Query, fdb, options,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  Query = require('./');

  options = {
    limit: null,
    streamingMode: fdb.streamingMode.iterator
  };

  module.exports = function(db) {
    var BatchQuery;
    return BatchQuery = (function(_super) {
      __extends(BatchQuery, _super);

      function BatchQuery(subspace, key0, key1, func) {
        this.func = func;
        BatchQuery.__super__.constructor.call(this, subspace, key0, key1);
      }

      BatchQuery.prototype.getOptions = function() {
        return options;
      };

      BatchQuery.prototype.iterate = function(iterator, callback) {
        return iterator.forEachBatch(this.func, callback);
      };

      return BatchQuery;

    })(Query(db));
  };

}).call(this);
