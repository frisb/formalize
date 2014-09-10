(function() {
  var ActiveCounter, Factory, counters, extensions, objectToArray,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ActiveCounter = require('./activecounter');

  extensions = {};

  counters = {};

  Factory = {
    ActiveRecords: function(typeName, options, callback) {
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

          Extension.prototype.counters = provider.ActiveCounter(typeName, options);

          return Extension;

        })(require("../provider/" + this.dbType + "/activerecord")(options));
        return Extension.init(callback);
      } else if (callback) {
        return callback(Extension);
      } else {
        return Extension;
      }
    },
    ActiveCounters: function(typeName, options) {
      var activeCounter, c, key;
      key = "" + this.dbType + ":" + this.dbName + ":" + typeName;
      activeCounter = counters[key];
      if (!activeCounter && options.counters) {
        c = !(options.counters instanceof Array) ? objectToArray(options.counters) : options.counters;
        activeCounter = new ActiveCounter(c);
        return counters[key] = activeCounter;
      } else {
        return activeCounter;
      }
    }
  };

  module.exports = Factory;

  objectToArray = function(obj) {
    var arr, counter, counterName;
    arr = [];
    for (counterName in obj) {
      counter = obj[counterName];
      counter.name = counterName;
      arr.push(counter);
    }
    return arr;
  };

}).call(this);
