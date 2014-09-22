(function() {
  var ArrayIterator, Iterator, fdb, options,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  Iterator = require('./');

  options = {
    limit: null,
    streamingMode: fdb.streamingMode.wantAll
  };

  module.exports = ArrayIterator = (function(_super) {
    __extends(ArrayIterator, _super);

    function ArrayIterator() {
      return ArrayIterator.__super__.constructor.apply(this, arguments);
    }

    ArrayIterator.prototype.getOptions = function() {
      return options;
    };

    ArrayIterator.prototype.iterate = function(iterator, callback) {
      return iterator.toArray(callback);
    };

    return ArrayIterator;

  })(Iterator);

}).call(this);
