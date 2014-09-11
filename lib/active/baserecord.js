(function() {
  var ActiveSchema,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ActiveSchema = require('./schema');

  module.exports = function(options) {
    var BaseRecord;
    return BaseRecord = (function(_super) {
      __extends(BaseRecord, _super);

      function BaseRecord(id) {
        this.changed = [];
        this.isLoaded = false;
        this.isNew = true;
        if (typeof id !== 'undefined') {
          this.id = id;
        }
      }

      BaseRecord.prototype.set = function(key, val) {
        var dest;
        dest = BaseRecord.__super__.set.call(this, key, val);
        return this.changed.push(dest);
      };

      return BaseRecord;

    })(ActiveSchema(options));
  };

}).call(this);
