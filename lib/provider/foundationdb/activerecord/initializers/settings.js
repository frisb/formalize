(function() {
  var async, deepak, fdb;

  async = require('async');

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  module.exports = function(ActiveRecord, callback) {
    var Setting, eachCallback, initSetting, provider;
    provider = ActiveRecord.prototype.provider;
    Setting = (function() {
      function Setting(name, cb) {
        this.name = name;
        this.cb = cb;
        this.value = ActiveRecord.prototype[this.name];
        this.key = provider.dir.settings.pack([this.name]);
      }

      Setting.prototype.activated = function() {
        this.value.active = true;
        return this.cb(null);
      };

      Setting.prototype.loadCallback = function(initializer) {
        if (initializer !== null) {
          this.value.init(initializer);
          return this.activated();
        } else if (this.value) {
          return this.save(ActiveRecord, this.value.initializer);
        } else {
          throw new Error("No " + this.name + " provided for ActiveRecord type '" + ActiveRecord.prototype.typeName + "'");
        }
      };

      Setting.prototype.load = function(ActiveRecord) {
        return provider.db.get(this.key, (function(_this) {
          return function(err, val) {
            if (err) {
              return console.error(err);
            } else {
              return _this.loadCallback(deepak.unpack(val));
            }
          };
        })(this));
      };

      Setting.prototype.save = function(ActiveRecord, initializer) {
        provider.db.set(this.key, deepak.pack(initializer));
        return this.activated();
      };

      Setting.prototype.init = function() {
        if (this.value && this.value.active) {
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
    return async.each(['schema', 'counters'], initSetting, eachCallback);
  };

}).call(this);
