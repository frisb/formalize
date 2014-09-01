(function() {
  var Record,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Record = require('../record');

  module.exports = function(options) {
    var ActiveRecord;
    ActiveRecord = (function(_super) {
      __extends(ActiveRecord, _super);

      function ActiveRecord() {
        return ActiveRecord.__super__.constructor.apply(this, arguments);
      }

      ActiveRecord.prototype.load = function() {
        throw new Error('not implemented');
      };

      ActiveRecord.prototype.save = function() {
        throw new Error('not implemented');
      };

      ActiveRecord.prototype.increment = function() {
        throw new Error('not implemented');
      };

      ActiveRecord.prototype.count = function() {
        throw new Error('not implemented');
      };

      return ActiveRecord;

    })(Record(options));
    ActiveRecord.init = function(callback) {
      throw new Error('not implemented');
    };
    ActiveRecord.all = function() {
      throw new Error('not implemented');
    };
    ActiveRecord.fetch = function() {
      throw new Error('not implemented');
    };
    ActiveRecord.prototype.typeName = null;
    return ActiveRecord;
  };

}).call(this);
