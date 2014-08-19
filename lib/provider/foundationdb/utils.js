(function() {
  var fdb, packArray, packValue, unpackArray, unpackValue;

  fdb = require('fdb').apiVersion(200);

  packValue = function(val) {
    switch (typeof val) {
      case 'undefined':
        return fdb.tuple.pack([0, '']);
      case 'string':
        return fdb.tuple.pack([1, new Buffer(val)]);
      case 'number':
        if (val % 1 === 0) {
          return fdb.tuple.pack([2, val]);
        } else {
          return fdb.tuple.pack([3, new Buffer('' + val)]);
        }
        break;
      case 'boolean':
        return fdb.tuple.pack([4, (val ? 1 : 0)]);
      default:
        if (val === null) {
          return fdb.tuple.pack([5, '']);
        } else if (val instanceof Date) {
          return fdb.tuple.pack([6, val.getTime()]);
        } else if (val instanceof Array) {
          return fdb.tuple.pack([7, packArray(val)]);
        } else if (val instanceof Object) {
          return fdb.tuple.pack([8, new Buffer(JSON.stringify(val))]);
        } else {
          throw new Error("the packValue function only accepts string, number, boolean, date, array and object");
        }
    }
  };

  unpackValue = function(val) {
    var type, unpacked;
    if (!val) {
      return null;
    }
    unpacked = fdb.tuple.unpack(val);
    type = unpacked[0];
    val = unpacked[1];
    switch (type) {
      case 0:
        break;
      case 1:
        return '' + val.toString();
      case 2:
        return val;
      case 3:
        return parseFloat('' + val);
      case 4:
        return val === 1;
      case 5:
        return null;
      case 6:
        return new Date(val);
      case 7:
        return unpackArray(val);
      case 8:
        return JSON.parse('' + val);
      default:
        throw new Error("the type (" + type + ") of the passed val is unknown");
    }
  };

  packArray = function(val) {
    var arr, child, _i, _len;
    arr = [];
    for (_i = 0, _len = val.length; _i < _len; _i++) {
      child = val[_i];
      arr.push(packValue(child));
    }
    return fdb.tuple.pack(arr);
  };

  unpackArray = function(val) {
    var arr, child, _i, _len, _ref;
    arr = [];
    _ref = fdb.tuple.unpack(val);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      arr.push(unpackValue(child));
    }
    return arr;
  };

  module.exports = {
    pack: packValue,
    unpack: unpackValue
  };

}).call(this);
