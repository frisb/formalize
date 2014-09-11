(function() {
  var Iterator, deepak, fdb;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  module.exports = Iterator = (function() {
    function Iterator(ActiveRecord, indexName, key0, key1) {
      var i, subkey, _i, _j, _len, _len1, _ref, _ref1;
      this.ActiveRecord = ActiveRecord;
      this.indexName = indexName;
      this.key0 = key0;
      this.key1 = key1;
      if (this.indexName instanceof Array) {
        if (this.key0 instanceof Array) {
          this.key1 = this.key0;
        }
        this.key0 = this.indexName;
        this.indexName = null;
      } else {
        this.ActiveRecord.prototype.indexes[this.indexName].key;
        if (this.key0) {
          _ref = this.key0;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            subkey = _ref[i];
            this.key0[i] = deepak.pack(subkey);
          }
        }
        if (this.key1) {
          _ref1 = this.key1;
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            subkey = _ref1[i];
            this.key1[i] = deepak.pack(subkey);
          }
        }
      }
    }

    Iterator.prototype.toArray = require('./toarray');

    Iterator.prototype.forEachBatch = require('./foreachbatch');

    Iterator.prototype.forEach = require('./foreach');

    return Iterator;

  })();

}).call(this);
