(function() {
  var ActiveFactory, Debug, EventEmitter, Provider, async, config, getConfig, path, testDir, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  async = require('async');

  ActiveFactory = require('../active/factory');

  Debug = require('./debug');

  EventEmitter = require('events').EventEmitter;

  path = require('path');

  config = null;

  testDir = function(dir) {
    var e, fileName;
    fileName = path.join(dir, 'formalize');
    try {
      return require(fileName) || require(fileName + '.json');
    } catch (_error) {
      e = _error;
    }
  };

  getConfig = function(dbType) {
    var dir, _i, _len, _ref;
    if (config === null) {
      _ref = [path.dirname(require.main.filename), process.cwd()];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dir = _ref[_i];
        config = testDir(dir);
        if (config) {
          return config[dbType];
        }
      }
    }
  };


  /* Abstract Provider class
  @param {String} dbName Database name.
  @param {String} dbType Database system type.
   */

  module.exports = Provider = (function(_super) {
    __extends(Provider, _super);

    function Provider(dbType, dbName) {
      this.dbType = dbType;
      this.dbName = dbName;
      this.status = 'disconnected';
      this.db = null;
      this.ActiveRecord = ActiveFactory.createRecord;
      this.ActiveIndex = ActiveFactory.createIndex;
      this.ActiveCounter = ActiveFactory.createCounter;
    }

    Provider.prototype._configure = function(callback) {
      var activeRecordConfigs, createActiveRecord, mapCallback;
      this.config = getConfig(this.dbType);
      this.debug = new Debug(this.config.debug);
      this.force = this.config.force || false;
      activeRecordConfigs = _.pairs(this.config[this.dbName]);
      createActiveRecord = (function(_this) {
        return function(pair, cb) {
          var TypedActiveRecord;
          TypedActiveRecord = _this.ActiveRecord(pair[0], pair[1]);
          return TypedActiveRecord.init(function(Extension) {
            return cb(null, Extension);
          });
        };
      })(this);
      mapCallback = function(err, results) {
        if (err) {
          return console.error(err);
        } else {
          return callback();
        }
      };
      return async.map(activeRecordConfigs, createActiveRecord, mapCallback);
    };

    Provider.prototype.connect = function(options) {
      var callback;
      switch (this.status) {
        case 'connected':
          this.emit('connected', this);
          break;
        case 'disconnected':
          this.status = 'connecting';
          callback = (function(_this) {
            return function(db) {
              _this.status = 'connected';
              _this.db = db;
              return _this._configure(function() {
                return _this.emit('connected', _this);
              });
            };
          })(this);
          this.init(options, callback);
      }
      return this;
    };

    Provider.prototype.init = function(options, callback) {
      throw new Error('not implemented');
    };

    return Provider;

  })(EventEmitter);

}).call(this);
