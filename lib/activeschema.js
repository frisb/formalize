(function() {
  var Formality,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Formality = require('formality');

  module.exports = function(options) {
    var ActiveSchema, k, schema, v, _ref;
    if (options.schema instanceof Array) {
      schema = ['id'].concat(options.schema);
    } else {
      schema = {
        id: 'id'
      };
      _ref = options.schema;
      for (k in _ref) {
        v = _ref[k];
        schema[k] = v;
      }
    }
    return ActiveSchema = (function(_super) {
      __extends(ActiveSchema, _super);

      function ActiveSchema() {
        return ActiveSchema.__super__.constructor.apply(this, arguments);
      }

      return ActiveSchema;

    })(Formality(schema));
  };

}).call(this);
