(function() {
  var async, fdb, paths;

  async = require('async');

  fdb = require('fdb').apiVersion(200);

  paths = ['settings', 'records', 'indexes', 'counters'];

  module.exports = function(ActiveRecord, callback) {
    var createDirectory, mapCallback, provider, typeName;
    provider = ActiveRecord.prototype.provider;
    if (provider.dir !== null) {
      return callback();
    } else {
      provider.dir = Object.create(null);
      typeName = ActiveRecord.prototype.typeName;
      createDirectory = (function(_this) {
        return function(path, cb) {
          return fdb.directory.createOrOpen(provider.db, [provider.dbName, typeName, path], {}, cb);
        };
      })(this);
      mapCallback = function(err, results) {
        var i, path, _i, _len;
        if (err) {
          return console.error(err);
        } else {
          for (i = _i = 0, _len = paths.length; _i < _len; i = ++_i) {
            path = paths[i];
            provider.dir[path] = results[i];
          }
          return callback();
        }
      };
      return async.map(paths, createDirectory, mapCallback);
    }
  };

}).call(this);
