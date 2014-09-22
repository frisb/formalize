(function() {
  var EachIterator, deepak, fdb, getFunc;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  EachIterator = require('../iterator/each');

  getFunc = function(ActiveRecord, provider, fluxRecord, callback) {
    return function(pair, next) {
      var dest, id, key, rec;
      key = provider.dir.records.unpack(pair.key);
      id = key[0];
      dest = key[1];
      if (fluxRecord !== null) {
        rec = fluxRecord;
        if (fluxRecord.id !== id) {
          callback(fluxRecord);
          rec = new ActiveRecord(id);
        }
      } else {
        rec = new ActiveRecord(id);
      }
      fluxRecord = rec;
      return next();
    };
  };

  module.exports = function(tr, callback) {
    var fluxRecord, func, iterator, provider;
    if (typeof tr === 'function') {
      callback = tr;
      tr = null;
    }
    provider = this.ActiveRecord.prototype.provider;
    fluxRecord = null;
    func = getFunc(this.ActiveRecord, provider, fluxRecord, callback);
    iterator = new EachIterator(provider, provider.dir.records, this.key0, this.key1);
    return iterator.execute(tr, func);
  };

}).call(this);
