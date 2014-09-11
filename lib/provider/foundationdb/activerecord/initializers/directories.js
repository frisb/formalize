(function() {
  var async, fdb, rootDirectoryNames;

  async = require('async');

  fdb = require('fdb').apiVersion(200);

  rootDirectoryNames = ['settings', 'records', 'indexes', 'counters'];

  module.exports = function(ActiveRecord, callback) {
    var createDirectory, item, mapCallback, mechanism, name, path, paths, provider, typeName, _i, _j, _len, _len1, _ref;
    provider = ActiveRecord.prototype.provider;
    if (provider.dir !== null) {
      return callback();
    } else {
      provider.dir = Object.create(null);
      typeName = ActiveRecord.prototype.typeName;
      paths = [];
      for (_i = 0, _len = rootDirectoryNames.length; _i < _len; _i++) {
        name = rootDirectoryNames[_i];
        path = [provider.dbName, typeName, name];
        switch (name) {
          case 'indexes':
          case 'counters':
            provider.dir[name] = Object.create(null);
            mechanism = ActiveRecord.prototype[name];
            _ref = mechanism.items;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              item = _ref[_j];
              paths.push(path.concat([item.name]));
            }
            break;
          default:
            paths.push(path);
        }
      }
      createDirectory = (function(_this) {
        return function(path, cb) {
          return fdb.directory.createOrOpen(provider.db, path, {}, cb);
        };
      })(this);
      mapCallback = function(err, results) {
        var containerItem, containerName, directory, i, _k, _len2;
        if (err) {
          return console.error(err);
        } else {
          for (i = _k = 0, _len2 = paths.length; _k < _len2; i = ++_k) {
            path = paths[i];
            directory = results[i];
            containerName = path[2];
            if (path.length === 4) {
              containerItem = path[3];
              provider.dir[containerName][containerItem] = directory;
            } else {
              provider.dir[containerName] = directory;
            }
          }
          return callback();
        }
      };
      return async.map(paths, createDirectory, mapCallback);
    }
  };

}).call(this);
