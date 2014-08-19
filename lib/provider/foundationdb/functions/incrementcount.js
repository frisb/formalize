(function() {
  var deepak, fdb;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  module.exports = function(ActiveCounter) {
    var ensureDirectories, key;
    key = ActiveCounter.prototype.key;
    ensureDirectories = this.getEnsureDirectoriesFunction(ActiveRecord);
    return function(tr0, callback) {
      if (typeof tr0 === 'function') {
        callback = tr0;
        tr0 = null;
      }
      return ensureDirectories((function(_this) {
        return function(dir) {
          var transaction;
          transaction = function(tr, innerCallback) {
            var counter, counterName, d, inc, prop, val, _i, _j, _len, _len1, _ref, _ref1;
            if (_this.id == null) {
              _this.id = generateID();
            }
            tr.set(dir.records.pack([_this.id]), deepak.pack(''));
            _ref = schema.dest;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              d = _ref[_i];
              if (d !== 'id') {
                val = _this.data[d];
                tr.set(dir.records.pack([_this.id, d]), deepak.pack(val));
              }
            }
            _ref1 = _this.counters;
            for (counterName in _ref1) {
              counter = _ref1[counterName];
              key = [];
              for (_j = 0, _len1 = counter.length; _j < _len1; _j++) {
                prop = counter[_j];
                val = _this.data[prop];
                key.push(deepak.pack(val));
              }
            }
            inc = new Buffer(4);
            inc.writeUInt32LE(1, 0);
            tr.add(dir.counters.pack(key), inc);
            _this.isNew = false;
            _this.isLoaded = true;
            _this.changed = [];
            return innerCallback(null, _this);
          };
          if (tr0) {
            return fdb.future.create(function(futureCb) {
              return transaction(tr0, futureCb);
            }, callback);
          } else {
            return db.doTransaction(transaction, callback);
          }
        };
      })(this));
    };
  };

}).call(this);
