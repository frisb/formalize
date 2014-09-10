(function() {
  var BatchQuery, deepak, fdb, getFunc, reset;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  BatchQuery = require('../query/batch');

  getFunc = function(ActiveRecord, state, callback) {
    var subspace;
    subspace = ActiveRecord.prototype.provider.dir.records;
    return function(arr, next) {
      var dest, id, key, pair, rec, val, _i, _len;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        pair = arr[_i];
        key = subspace.unpack(pair.key);
        id = key[0];
        dest = key[1];
        if (state.fluxRecord !== null) {
          rec = state.fluxRecord;
          if (state.fluxRecord.id !== id) {
            reset(state.fluxRecord);
            state.pendingBatch.push(rec);
            rec = new ActiveRecord(id);
          }
        } else {
          rec = new ActiveRecord(id);
        }
        if (dest) {
          val = deepak.unpack(pair.value);
          if (typeof val !== 'undefined') {
            rec.data[dest] = val;
          }
        }
        state.fluxRecord = rec;
      }
      if (state.pendingBatch.length > 0) {
        callback(null, state.pendingBatch);
        state.pendingBatch = [];
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
    var complete, func, provider, query, state;
    if (typeof tr === 'function') {
      callback = tr;
      tr = null;
    }
    provider = this.ActiveRecord.prototype.provider;
    state = {
      pendingBatch: [],
      fluxRecord: null
    };
    func = getFunc(this.ActiveRecord, state, callback);
    query = new BatchQuery(provider.db, provider.dir.records, this.key0, this.key1, func);
    complete = function(err, res) {
      console.log('complete');
      console.log(err);
      if (state.fluxRecord !== null) {
        reset(state.fluxRecord);
        callback(err, [state.fluxRecord]);
      }
      return callback(err, null);
    };
    return query.execute(tr, complete);
  };

}).call(this);
