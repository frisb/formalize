(function() {
  var databases, factory;

  databases = {};

  factory = function(dbType) {
    var Database;
    Database = require("./database/" + dbType);
    return function(name, options, callback) {
      var F, dbKey;
      if (typeof options === 'function') {
        callback = options;
        options = null;
      }
      dbKey = "" + dbType + ":" + name;
      F = databases[dbKey];
      if (!F) {
        F = new Database(name);
        databases[dbKey] = F;
      }
      if (callback) {
        F.on('connected', callback);
      }
      return F.connect(options);
    };
  };

  module.exports = factory('foundationdb');

}).call(this);
