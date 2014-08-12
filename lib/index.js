(function() {
  module.exports = function(dbType) {
    var Adapter, adapter;
    Adapter = require('./adapter');
    adapter = new Adapter(dbType);
    return {
      db: adapter.db,
      ActiveRecord: require('./activerecord')(dbType)
    };
  };

}).call(this);
