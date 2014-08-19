(function() {
  var Formality,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Formality = require('formality');

  module.exports = function(schema) {
    var Record;
    return Record = (function(_super) {
      __extends(Record, _super);

      function Record(id) {
        this.changed = [];
        this.isLoaded = false;
        this.isNew = true;
        if (id) {
          this.id = id;
        }
      }

      Record.prototype.set = function(key, val) {
        var dest;
        dest = Record.__super__.set.call(this, key, val);
        return this.changed.push(dest);
      };

      return Record;

    })(Formality(schema));
  };

}).call(this);
