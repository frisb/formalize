(function() {
  var ArrayIterator, deepak, fdb;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  ArrayIterator = require('../iterator/array');

  module.exports = function(tr, callback) {
    var complete, iterator, provider;
    if (typeof tr === 'function') {
      callback = tr;
      tr = null;
    }
    provider = this.ActiveRecord.prototype.provider;
    iterator = new ArrayIterator(provider, provider.dir.records, this.key0, this.key1);
    complete = function(err, arr) {
      var dest, i, id, key, map, pair, rec, result, _i, _j, _len, _len1;
      result = [];
      map = Object.create(null);
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
          rec.data(dest, deepak.unpack(pair.value));
          result[i] = rec;
        }
      }
      map = null;
      for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
        rec = result[_j];
        rec.reset(true);
      }
      return callback(err, result);
    };
    return iterator.execute(tr, complete);
  };

}).call(this);
