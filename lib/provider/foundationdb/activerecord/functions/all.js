(function() {
  var deepak, fdb, getFunc, reset;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  getFunc = function(ActiveRecord, provider, result, map) {
    return function(arr, next) {
      var dest, i, id, key, pair, rec, _i, _len;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        pair = arr[_i];
        key = provider.dir.records.unpack(pair.key);
        id = key[0];
        dest = key[1];
        i = map[id];
        if (typeof i !== 'undefined') {
          rec = result[i];
        } else {
          i = result.length;
          map[id] = i;
          rec = new ActiveRecord(id);
          result.push(rec);
        }
        if (dest) {
          rec.data[dest] = deepak.unpack(pair.value);
          result[i] = rec;
        }
      }
      return next();
    };
  };

  reset = function(rec) {
    rec.isNew = false;
    rec.isLoaded = true;
    return rec.changed = [];
  };

  module.exports = function(tr, callback) {
    var ActiveRecord, BatchQuery, func, map, provider, query, result;
    if (typeof tr === 'function') {
      callback = tr;
      tr = null;
    }
    BatchQuery = require('../query/batch')(this.db);
    ActiveRecord = this;
    provider = ActiveRecord.prototype.provider;
    result = [];
    map = Object.create(null);
    func = getFunc(ActiveRecord, provider, result, map);
    query = new BatchQuery(provider.dir.records, func);
    return fdb.future.create(function(futureCb) {
      var complete;
      complete = function(err, res) {
        var rec, _i, _len;
        map = null;
        for (_i = 0, _len = result.length; _i < _len; _i++) {
          rec = result[_i];
          reset(rec);
        }
        return futureCb(err, result);
      };
      return query.execute(tr, complete);
    }, callback);
  };

}).call(this);
