(function() {
  var BatchIterator, deepak, fdb, getFunc;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  BatchIterator = require('../iterator/batch');

  getFunc = function(ActiveRecord, subspace, state, callback) {
    return function(arr, next) {
      var key;
      key = null;
      process.nextTick(function() {
        var dest, i, id, pair, rec, subkey, val, _i, _j, _len, _len1, _ref;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          pair = arr[_i];
          key = subspace.unpack(pair.key);
          if (state.indexKey) {
            rec = new ActiveRecord(null);
            _ref = state.indexKey;
            for (i = _j = 0, _len1 = _ref.length; _j < _len1; i = ++_j) {
              subkey = _ref[i];
              if (typeof subkey !== 'function') {
                val = deepak.unpackValue(key[i]);
                if (typeof val !== 'undefined') {
                  rec.data(subkey, val);
                }
              }
            }
            rec.reset(true);
            state.pendingBatch.push(rec);
          } else {
            id = key[0];
            dest = key[1];
            if (state.fluxRecord !== null) {
              rec = state.fluxRecord;
              if (state.fluxRecord.id !== id) {
                state.fluxRecord.reset(true);
                state.pendingBatch.push(rec);
                rec = new ActiveRecord(id);
              }
            } else {
              rec = new ActiveRecord(id);
            }
            if (dest) {
              val = deepak.unpackValue(pair.value);
              if (typeof val !== 'undefined') {
                rec.data(dest, val);
              }
            }
          }
          state.fluxRecord = rec;
        }
        if (state.pendingBatch.length > 0) {
          state.iterator.marker = key;
          callback(null, state.pendingBatch);
          return state.pendingBatch = [];
        }
      });
      return next();
    };
  };

  module.exports = function(tr, callback) {
    var complete, func, iterator, provider, state, subspace;
    if (typeof tr === 'function') {
      callback = tr;
      tr = null;
    }
    provider = this.ActiveRecord.prototype.provider;
    state = {
      pendingBatch: [],
      fluxRecord: null
    };
    if (this.indexName !== null) {
      subspace = provider.dir.indexes[this.indexName];
      state.indexKey = this.ActiveRecord.prototype.indexes[this.indexName].key;
    } else {
      subspace = provider.dir.records;
    }
    func = getFunc(this.ActiveRecord, subspace, state, callback);
    iterator = new BatchIterator(provider, subspace, this.key0, this.key1, func);
    state.iterator = iterator;
    complete = function(err, res) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        if (state.fluxRecord !== null) {
          state.fluxRecord.reset(true);
          callback(null, [state.fluxRecord]);
        }
        return callback(null, null);
      }
    };
    return iterator.execute(tr, complete);
  };

}).call(this);
