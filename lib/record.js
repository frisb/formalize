(function() {
  var ObjectID, Record;

  ObjectID = require('bson').ObjectID;

  module.exports = Record = (function() {
    var save;

    function Record(id) {
      this.id = id;
      if (!this.id) {
        this.id = new ObjectID().toHexString();
      }
    }

    save = function() {
      var transaction;
      transaction = (function(_this) {
        return function(tr, innerCallback) {
          var index, prop, _i, _j, _len, _len1, _ref;
          tr.set(_this.subspace.pack([_this.id]), '');
          _ref = _this.schema;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            tr.set(_this.subspace.pack([_this.id, prop]), utils.pack(_this.attributes[prop]));
          }
          for (_j = 0, _len1 = indexes.length; _j < _len1; _j++) {
            index = indexes[_j];
            index;
          }
          return innerCallback(null);
        };
      })(this);
      return db.doTransaction(transaction, callback);
    };

    return Record;

  })();

  Record.prototype.attributes = Object.create(null);

  Record.prototype.previous = Object.create(null);

  Record.fetch = function(indexSpace, key0, key1) {
    var callback, transaction;
    transaction = function(tr, innerCallback) {
      var iterator, opt, r0, r1;
      r0 = indexSpace.range(key0);
      r1 = indexSpace.range(key1);
      opt = options || {
        limit: null,
        reverse: true,
        streamingMode: fdb.streamingMode.iterator
      };
      iterator = tr.getRange(range0.begin, range1.end, options);
      return iterator.toArray(function(err, arr) {
        var key, pair, result, _i, _len;
        result = [];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          pair = arr[_i];
          key = indexSpace.unpack(pair.key);
          key[1] = new Date(key[1]);
          result.push(key);
        }
        return innerCallback(null, result);
      });
    };
    callback = function(err, val) {
      console.log('stars:');
      return console.log(val);
    };
    return db.doTransaction(transaction, callback);
  };

}).call(this);
