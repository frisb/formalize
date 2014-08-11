(function() {
  var db, fdb;

  fdb = require('fdb').apiVersion(200);

  db = fdb.open();

  module.exports = {
    db: db,
    utils: require('./utils')(fdb),
    ActiveRecord: require('./activerecord')(fdb, db)
  };

}).call(this);
