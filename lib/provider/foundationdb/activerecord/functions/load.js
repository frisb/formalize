(function() {
  var ArrayQuery, deepak, fdb;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  ArrayQuery = require('../query/array');

  module.exports = function(tr, callback) {
    var query, queryCallback;
    if (typeof tr === 'function') {
      callback = tr;
      tr = null;
    }
    query = new ArrayQuery(this.provider.db, this.provider.dir.records, [this.id], [this.id]);
    queryCallback = (function(_this) {
      return function(err, arr) {
        var dest, key, pair, _i, _len;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          pair = arr[_i];
          key = _this.provider.dir.records.unpack(pair.key);
          dest = key[1];
          _this.data[dest] = deepak.unpack(pair.value);
        }
        if (!err) {
          _this.isLoaded = true;
          _this.isNew = false;
        }
        return callback(err);
      };
    })(this);
    return query.execute(tr, queryCallback);
  };

}).call(this);
