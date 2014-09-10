(function() {
  var EachQuery, Query, fdb, options,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  Query = require('./');

  options = {
    limit: null,
    streamingMode: fdb.streamingMode.iterator
  };

  module.exports = EachQuery = (function(_super) {
    __extends(EachQuery, _super);

    function EachQuery() {
      return EachQuery.__super__.constructor.apply(this, arguments);
    }

    EachQuery.prototype.getOptions = function() {
      return options;
    };

    EachQuery.prototype.iterate = function(iterator, callback) {
      return iterator.forEach(callback);
    };

    return EachQuery;

  })(Query);

}).call(this);
