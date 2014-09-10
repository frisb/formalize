(function() {
  var ActiveMechanism, Factory, extensions,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ActiveMechanism = require('./mechanism');

  extensions = {};

  Factory = {
    createRecord: function(typeName, options, callback) {
      var Extension, key, provider;
      provider = this;
      key = "" + this.dbType + ":" + this.dbName + ":" + typeName;
      Extension = extensions[key];
      if (!Extension) {
        extensions[key] = Extension = (function(_super) {
          __extends(Extension, _super);

          function Extension() {
            return Extension.__super__.constructor.apply(this, arguments);
          }

          Extension.prototype.provider = provider;

          Extension.prototype.typeName = typeName;

          Extension.prototype.indexes = provider.ActiveIndex(typeName, options);

          Extension.prototype.counters = provider.ActiveCounter(typeName, options);

          return Extension;

        })(require("../provider/" + this.dbType + "/activerecord")(options));
        if (callback) {
          return Extension.init(callback);
        } else {
          return Extension;
        }
      } else if (callback) {
        return callback(Extension);
      } else {
        return Extension;
      }
    },
    createIndex: function(typeName, options) {
      return ActiveMechanism(typeName, 'indexes', options);
    },
    createCounter: function(typeName, options) {
      return ActiveMechanism(typeName, 'counters', options);
    }
  };

  module.exports = Factory;

}).call(this);
