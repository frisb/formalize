(function() {
  var Record,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Record = require('./record');

  module.exports = function(options) {
    var ActiveRecord;
    return ActiveRecord = (function(_super) {
      __extends(ActiveRecord, _super);

      function ActiveRecord() {
        return ActiveRecord.__super__.constructor.apply(this, arguments);
      }

      ActiveRecord.prototype.provider = null;

      ActiveRecord.prototype.typeName = null;

      ActiveRecord.prototype.load = function() {
        throw new Error('not implemented');
      };

      ActiveRecord.prototype.save = function() {
        throw new Error('not implemented');
      };

      ActiveRecord.prototype.index = function() {
        throw new Error('not implemented');
      };

      ActiveRecord.prototype.add = function() {
        throw new Error('not implemented');
      };

      ActiveRecord.prototype.count = function() {
        throw new Error('not implemented');
      };

      ActiveRecord.init = function(callback) {
        throw new Error('not implemented');
      };

      ActiveRecord.all = function() {
        throw new Error('not implemented');
      };

      ActiveRecord.fetch = function() {
        throw new Error('not implemented');
      };

      return ActiveRecord;

    })(Record(options));
  };

}).call(this);
