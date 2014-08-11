(function() {
  var ObjectID;

  ObjectID = require('bson').ObjectID;

  module.exports = function(fdb, db) {
    var Record, rangeQuery, utils;
    utils = require('./utils')(fdb);
    rangeQuery = function(subspace, key0, key1, options, callback, tr0) {
      var transaction;
      transaction = function(tr, innerCallback) {
        var fn, iterator, r0, r1;
        r0 = subspace.range(key0);
        r1 = subspace.range(key1);
        iterator = tr.getRange(r0.begin, r1.end, options || {});
        fn = iterator.forEachBatch;
        if (options.streamingMode === fdb.streamingMode.iterator) {
          fn = iterator.toArray;
        }
        return fn.call(iterator, innerCallback);
      };
      if (tr0) {
        return transaction(tr0, callback);
      } else {
        return db.doTransaction(transaction, callback);
      }
    };
    Record = (function() {
      function Record(id) {
        this.id = id;
        if (!this.id) {
          this.id = new ObjectID().toHexString();
        }
      }

      Record.prototype.load = function(tr, callback) {
        var cb, options;
        if (typeof tr === 'function') {
          callback = tr;
          tr = null;
        }
        options = {
          limit: null,
          streamingMode: fdb.streamingMode.want_all
        };
        cb = (function(_this) {
          return function(err, arr) {
            var destKey, key, pair, srcKey, _i, _len;
            for (_i = 0, _len = arr.length; _i < _len; _i++) {
              pair = arr[_i];
              key = _this.subspace.unpack(pair.key);
              destKey = key[1];
              srcKey = _this.schema.src[_this.schema.map[destKey]];
              _this[srcKey] = utils.unpack(pair.value);
            }
            if (!err) {
              _this.isLoaded = true;
              _this.isNew = false;
            }
            return callback(err);
          };
        })(this);
        return rangeQuery(this.subspace, [this.id], [this.id], options, cb, tr);
      };

      Record.prototype.save = function(tr, callback) {
        var transaction;
        transaction = (function(_this) {
          return function(tr, innerCallback) {
            var dest, i, src, val, _i, _len, _ref;
            tr.set(_this.subspace.pack([_this.id]), '');
            _ref = _this.schema.src;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              src = _ref[i];
              dest = _this.schema.dest[i];
              val = _this[src];
              tr.set(_this.subspace.pack([_this.id, dest]), utils.pack(val));
            }
            _this.isNew = false;
            return innerCallback(null);
          };
        })(this);
        if (typeof tr === 'function') {
          callback = tr;
          return db.doTransaction(transaction, callback);
        } else {
          return transaction(tr, callback);
        }
      };

      return Record;

    })();
    Record.fetch = function(subspace, key0, key1, options) {
      var callback;
      options = {
        limit: null,
        streamingMode: fdb.streamingMode.iterator
      };
      callback = function(err, arr) {
        return console.log(arr);
      };
      return rangeQuery(subspace, key0, key1, options, callback);
    };
    return Record;
  };

}).call(this);
