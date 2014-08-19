(function() {
  var fdb, utils;

  fdb = require('fdb').apiVersion(200);

  utils = require('../utils');

  module.exports = function(ActiveRecord) {
    var ArrayQuery, provide, schema;
    ArrayQuery = require('../query/array')(this.db);
    schema = ActiveRecord.prototype.schema;
    provide = this.getProviderFunction(ActiveRecord);
    return function(tr, callback) {
      if (typeof tr === 'function') {
        callback = tr;
        tr = null;
      }
      return provide((function(_this) {
        return function(provider) {
          var query;
          query = new ArrayQuery(provider.dir.records, [_this.id], [_this.id]);
          return query.execute(tr, function(err, arr) {
            var dest, key, pair, _i, _len;
            for (_i = 0, _len = arr.length; _i < _len; _i++) {
              pair = arr[_i];
              key = provider.dir.records.unpack(pair.key);
              dest = key[1];
              _this.data[dest] = utils.unpack(pair.value);
            }
            if (!err) {
              _this.isLoaded = true;
              _this.isNew = false;
            }
            return callback(err);
          });
        };
      })(this));
    };
  };

}).call(this);
