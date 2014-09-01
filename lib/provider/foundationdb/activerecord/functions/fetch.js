(function() {
  var fdb;

  fdb = require('fdb').apiVersion(200);

  module.exports = function(ActiveRecord) {
    return function(query, tr, callback) {
      if (typeof tr === 'function') {
        callback = tr;
        tr = null;
      }
      return query.execute(tr, callback);
    };
  };

}).call(this);
