(function() {
  var fdb, utils;

  fdb = require('fdb').apiVersion(200);

  utils = require('../utils');

  module.exports = function(ActiveRecord) {
    var ArrayQuery, schema, subspace;
    ArrayQuery = require('../query/array')(this.db);
    subspace = this.getSubspace(ActiveRecord);
    schema = ActiveRecord.prototype.schema;
    return function(tr, callback) {
      var query;
      query = new ArrayQuery(subspace, [this.id], [this.id]);
      if (typeof tr === 'function') {
        callback = tr;
        tr = null;
      }
      return query.execute(tr, (function(_this) {
        return function(err, arr) {
          var dest, key, pair, _i, _len;
          for (_i = 0, _len = arr.length; _i < _len; _i++) {
            pair = arr[_i];
            key = subspace.unpack(pair.key);
            dest = key[1];
            _this.attributes[dest] = utils.unpack(pair.value);
          }
          if (!err) {
            _this.isLoaded = true;
            _this.isNew = false;
          }
          return callback(err);
        };
      })(this));
    };
  };

}).call(this);
