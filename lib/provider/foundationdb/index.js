(function() {
  var Formality, FoundationDB, Provider, Schema, async, deepak, fdb,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  async = require('async');

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  Formality = require('formality');

  Provider = require('../');

  Schema = require('../');

  module.exports = FoundationDB = (function(_super) {
    __extends(FoundationDB, _super);

    function FoundationDB(name) {
      this.ensureDirectories = __bind(this.ensureDirectories, this);
      FoundationDB.__super__.constructor.call(this, name);
      this.fdb = fdb;
      this.dir = null;
    }

    FoundationDB.prototype.init = function(options, callback) {
      var db;
      db = fdb.open();
      return process.nextTick(function() {
        return callback(db);
      });
    };

    FoundationDB.prototype.getIdGenerator = require("./functions/idgenerator");

    FoundationDB.prototype.getLoadFunction = require("./functions/load");

    FoundationDB.prototype.getSaveFunction = require("./functions/save");

    FoundationDB.prototype.getAllFunction = require("./functions/all");

    FoundationDB.prototype.getFetchFunction = require("./functions/fetch");

    FoundationDB.prototype.getProviderFunction = function(ActiveRecord) {
      return (function(_this) {
        return function(callback) {
          return _this.ensureDirectories(ActiveRecord, function() {
            return _this.ensureSchema(ActiveRecord, function() {
              return callback(_this);
            });
          });
        };
      })(this);
    };

    FoundationDB.prototype.ensureSchema = function(ActiveRecord, callback) {
      var activated, loadCallback, saveCallback, schema;
      schema = ActiveRecord.prototype.schema;
      if (schema && schema.active) {
        return callback();
      } else {
        activated = function() {
          schema.active = true;
          return callback();
        };
        saveCallback = function(err) {
          if (err) {
            return console.error(err);
          } else {
            return activated();
          }
        };
        loadCallback = (function(_this) {
          return function(initializer) {
            if (initializer !== null) {
              schema.init(initializer);
              return activated();
            } else if (schema) {
              return _this.saveSchema(ActiveRecord, schema.initializer, saveCallback);
            } else {
              throw new Error("No schema provided for ActiveRecord type '" + ActiveRecord.prototype.typeName + "'");
            }
          };
        })(this);
        return this.loadSchema(ActiveRecord, loadCallback);
      }
    };

    FoundationDB.prototype.loadSchema = function(ActiveRecord, callback) {
      var key;
      key = this.dir.settings.pack(['schema']);
      return this.db.get(key, function(err, val) {
        if (err) {
          return console.error(err);
        } else {
          return callback(deepak.unpack(val));
        }
      });
    };

    FoundationDB.prototype.saveSchema = function(ActiveRecord, initializer, callback) {
      var key;
      key = this.dir.settings.pack(['schema']);
      this.db.set(key, deepak.pack(initializer));
      return callback(null);
    };

    FoundationDB.prototype.ensureDirectories = function(ActiveRecord, callback) {
      var createDirectory, mapCallback, paths;
      if (this.dir !== null) {
        return callback(this.dir);
      } else {
        paths = ['settings', 'records', 'indexes', 'counters'];
        createDirectory = (function(_this) {
          return function(path, cb) {
            return fdb.directory.createOrOpen(_this.db, [_this.name, ActiveRecord.prototype.typeName, path], {}, cb);
          };
        })(this);
        mapCallback = (function(_this) {
          return function(err, results) {
            var i, path, _i, _len;
            if (err) {
              return console.error(err);
            } else {
              _this.dir = Object.create(null);
              for (i = _i = 0, _len = paths.length; _i < _len; i = ++_i) {
                path = paths[i];
                _this.dir[path] = results[i];
              }
              return callback();
            }
          };
        })(this);
        return async.map(paths, createDirectory, mapCallback);
      }
    };

    return FoundationDB;

  })(Provider);

}).call(this);
