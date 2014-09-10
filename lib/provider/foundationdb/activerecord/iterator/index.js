(function() {
  var Iterator;

  module.exports = Iterator = (function() {
    function Iterator(ActiveRecord, key0, key1) {
      this.ActiveRecord = ActiveRecord;
      this.key0 = key0;
      this.key1 = key1;
    }

    Iterator.prototype.toArray = require('./toarray');

    Iterator.prototype.forEachBatch = require('./foreachbatch');

    Iterator.prototype.forEach = require('./foreach');

    return Iterator;

  })();

}).call(this);
