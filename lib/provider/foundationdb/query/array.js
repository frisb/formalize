(function() {
  var Query, fdb, options,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  Query = require('./');

  options = {
    limit: null,
    streamingMode: fdb.streamingMode.wantAll
  };

  module.exports = function(db) {
    var ArrayQuery;
    return ArrayQuery = (function(_super) {
      __extends(ArrayQuery, _super);

      function ArrayQuery() {
        return ArrayQuery.__super__.constructor.apply(this, arguments);
      }

      ArrayQuery.prototype.getOptions = function() {
        return options;
      };

      ArrayQuery.prototype.iterate = function(iterator, callback) {
        return iterator.toArray(callback);
      };

      return ArrayQuery;

    })(Query(db));
  };

}).call(this);
