(function() {
  var fdb;

  fdb = require('fdb').apiVersion(200);

  module.exports = function(ActiveRecord) {
    return function(query, tr, callback) {
      if (typeof tr === 'function') {
        callback = tr;
        tr = null;
      }
      return fdb.future.create(function(futureCb) {
        return query.execute(tr, futureCb);
      }, callback);
    };
  };

}).call(this);
