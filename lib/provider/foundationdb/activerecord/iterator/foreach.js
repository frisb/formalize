(function() {
  var EachQuery, deepak, fdb, getFunc, reset;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  EachQuery = require('../query/each');

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

  reset = function(rec) {
    rec.isNew = false;
    rec.isLoaded = true;
    return rec.changed = [];
  };

  module.exports = function(tr, callback) {
    var fluxRecord, func, provider, query;
    if (typeof tr === 'function') {
      callback = tr;
      tr = null;
    }
    provider = this.ActiveRecord.prototype.provider;
    fluxRecord = null;
    func = getFunc(this.ActiveRecord, provider, fluxRecord, callback);
    query = new EachQuery(provider.db, provider.dir.records, this.key0, this.key1);
    return query.execute(tr, func);
  };

}).call(this);
