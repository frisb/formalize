(function() {
  var Query, deepak, fdb;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  module.exports = Query = (function() {
    function Query(ActiveRecord, indexName, key0, key1) {
      var debug;
      this.ActiveRecord = ActiveRecord;
      this.indexName = indexName;
      this.key0 = key0;
      this.key1 = key1;
      debug = this.ActiveRecord.prototype.provider.debug;
      if (this.indexName instanceof Array) {
        if (this.key0 instanceof Array) {
          this.key1 = this.key0;
        }
        this.key0 = this.indexName;
        this.indexName = null;
        debug.buffer('key0', this.key0);
      } else {
        debug.buffer('indexName', this.indexName);
        debug.buffer('indexKey', this.ActiveRecord.prototype.indexes[this.indexName].key);
        debug.buffer('key0', this.key0);
        debug.buffer('key1', this.key1);
        if (this.key0) {
          this.key0 = deepak.packArrayValues(this.key0);
        }
        if (this.key1) {
          this.key1 = deepak.packArrayValues(this.key1);
        }
      }
      debug.log('Query', this.ActiveRecord.prototype.typeName);
    }

    Query.prototype.toArray = require('./toarray');

    Query.prototype.forEachBatch = require('./foreachbatch');

    Query.prototype.forEach = require('./foreach');

    return Query;

  })();

}).call(this);
