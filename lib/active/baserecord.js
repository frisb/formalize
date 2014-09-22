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
        BaseRecord.__super__.constructor.call(this);
        this.reset();
        if (typeof id !== 'undefined') {
          this.id = id;
        }
      }

      BaseRecord.prototype.reset = function(isLoaded) {
        this.isLoaded = isLoaded;
        this.isNew = !isLoaded;
        return this.isChanged = false;
      };

      BaseRecord.prototype.setValue = function(key, val) {
        var dest;
        dest = BaseRecord.__super__.setValue.call(this, key, val);
        return this.isChanged = true;
      };

      return BaseRecord;

    })(ActiveSchema(options));
  };

}).call(this);
