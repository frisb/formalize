(function() {
  var deepak, fdb, save;

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  save = function(tr, rec, callback) {
    var d, val, _i, _len, _ref;
    tr.set(rec.provider.dir.records.pack([rec.id]), deepak.pack(''));
    _ref = rec.schema.dest;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      d = _ref[_i];
      if (d !== 'id') {
        val = rec.data[d];
        tr.set(rec.provider.dir.records.pack([rec.id, d]), deepak.pack(val));
      }
      rec.isNew = false;
      rec.isLoaded = true;
      rec.changed = [];
    }
    return callback(null);
  };

  module.exports = function(tr, callback) {
    if (typeof tr === 'function') {
      callback = tr;
      tr = null;
    }
    return fdb.future.create((function(_this) {
      return function(futureCb) {
        var transactionalSave;
        transactionalSave = fdb.transactional(save);
        return transactionalSave(tr || _this.provider.db, _this, futureCb);
      };
    })(this), callback);
  };

}).call(this);
