(function() {
  var BatchQuery, fdb, utils;

  fdb = require('fdb').apiVersion(200);

  utils = require('../utils');

  BatchQuery = require('../query/batch');

  module.exports = function(ActiveRecord) {
    var subspace;
    console.log(ActiveRecord);
    subspace = new fdb.Subspace([ActiveRecord.prototype.typeName]);
    return function(tr, callback) {
      var func, map, query, result;
      if (typeof tr === 'function') {
        callback = tr;
        tr = null;
      }
      result = [];
      map = Object.create(null);
      func = function(arr, next) {
        var dest, i, id, key, pair, rec, _i, _len;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          pair = arr[_i];
          key = subspace.unpack(pair.key);
          id = key[0];
          dest = key[1];
          i = map[id];
          if (i) {
            rec = result[i];
          } else {
            i = result.length;
            map[id] = i;
            rec = new ActiveRecord(id);
            result.push(rec);
          }
          console.log(rec);
          if (dest) {
            rec.attributes[dest] = utils.unpack(pair.value);
            rec.isNew = false;
            rec.isLoaded = true;
            result[i] = rec;
          }
        }
        return next();
      };
      query = new BatchQuery(subspace, [''], ['\\xff'], func);
      return fdb.future.create(function(futureCb) {
        var complete;
        complete = function(err, res) {
          var dict;
          dict = null;
          return futureCb(err, result);
        };
        return query.execute(tr, complete);
      }, callback);
    };
  };

}).call(this);
