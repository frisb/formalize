(function() {
  var EachIterator, Iterator, fdb, options,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  Iterator = require('./');

  options = {
    limit: null,
    streamingMode: fdb.streamingMode.iterator
  };

  module.exports = EachIterator = (function(_super) {
    __extends(EachIterator, _super);

    function EachIterator() {
      return EachIterator.__super__.constructor.apply(this, arguments);
    }

    EachIterator.prototype.getOptions = function() {
      return options;
    };

    EachIterator.prototype.iterate = function(iterator, callback) {
      return iterator.forEach(callback);
    };

    return EachIterator;

  })(Iterator);

}).call(this);
