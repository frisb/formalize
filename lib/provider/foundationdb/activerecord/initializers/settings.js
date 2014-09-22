(function() {
  var Debug, async, deepak, fdb, matchArray, _;

  _ = require('underscore');

  async = require('async');

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  Debug = require('../../../debug');

  matchArray = function(array1, array2) {
    var i, x, y, _i, _len;
    if (array1.length !== array2.length) {
      return false;
    }
    for (i = _i = 0, _len = array1.length; _i < _len; i = ++_i) {
      x = array1[i];
      y = array2[i];
      if (typeof x !== typeof y) {
        return false;
      }
      if (typeof x !== 'function') {
        if (!_.isEqual(x, y)) {
          return false;
        }
      }
    }
    return true;
  };

  module.exports = function(ActiveRecord, callback) {
    var Setting, eachCallback, initSetting, provider;
    provider = ActiveRecord.prototype.provider;
    Setting = (function() {
      function Setting(name, cb) {
        this.name = name;
        this.cb = cb;
        this.value = ActiveRecord.prototype[this.name];
        this.key = provider.dir.settings.pack([this.name]);
        this.debug = new Debug(provider.config.debug);
      }

      Setting.prototype.activated = function() {
        this.value.active = true;
        this.cb(null);
        return this.debug.log('Settings', this.name);
      };

      Setting.prototype.verify = function(initializer) {
        var deepEquals, x, y, _i, _j, _len, _len1, _ref;
        if (this.value.initializer.length !== initializer.length) {
          return false;
        }
        deepEquals = _.isEqual(this.value.initializer, initializer);
        if (!deepEquals) {
          _ref = this.value.initializer;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            for (_j = 0, _len1 = initializer.length; _j < _len1; _j++) {
              y = initializer[_j];
              if (x.name === y.name) {
                if (Object.keys(x).length !== Object.keys(y).length) {
                  return false;
                }
                if (!matchArray(x.key, y.key)) {
                  return false;
                }
              }
            }
          }
        }
        return true;
      };

      Setting.prototype.loadCallback = function(initializer) {
        var message, verified;
        if (initializer !== null) {
          this.debug.buffer('loaded from db', 1);
          verified = this.verify(initializer);
          this.debug.buffer('verified', verified);
          if (verified) {
            this.value.init(initializer);
            return this.activated();
          } else if (provider.force) {
            return this.save(ActiveRecord, this.value.initializer);
          } else {
            message = "Formalize FoundationDB provider configuration for " + this.name + " does not match the saved initializer. Either modify the config file accordingly, or use the 'force: true' provider flag to save the new configuration.";
            throw new Error(message);
          }
        } else if (this.value) {
          debug.buffer(this.name, 'initializer not loaded from db');
          return this.save(ActiveRecord, this.value.initializer);
        } else {
          throw new Error("No " + this.name + " provided for ActiveRecord type '" + ActiveRecord.prototype.typeName + "'");
        }
      };

      Setting.prototype.load = function(ActiveRecord) {
        this.debug.buffer('loading', 1);
        return provider.db.get(this.key, (function(_this) {
          return function(err, val) {
            if (err) {
              return console.error(err);
            } else {
              return _this.loadCallback(deepak.unpackValue(val));
            }
          };
        })(this));
      };

      Setting.prototype.save = function(ActiveRecord, initializer) {
        provider.db.set(this.key, deepak.packValue(initializer));
        this.debug.buffer('saved', 1);
        return this.activated();
      };

      Setting.prototype.init = function() {
        var active;
        active = this.value && this.value.active;
        this.debug.buffer('active', active);
        if (active) {
          return this.cb(null);
        } else {
          return this.load(ActiveRecord);
        }
      };

      return Setting;

    })();
    initSetting = function(name, cb) {
      var setting;
      setting = new Setting(name, cb);
      return setting.init();
    };
    eachCallback = function(err) {
      if (err) {
        return console.error(err);
      } else {
        return callback();
      }
    };
    return async.each(['schema', 'indexes', 'counters'], initSetting, eachCallback);
  };

}).call(this);
