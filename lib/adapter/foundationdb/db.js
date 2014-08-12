(function() {
  var db, fdb;

  fdb = require('fdb').apiVersion(200);

  db = fdb.open();

  module.exports = db;

}).call(this);
