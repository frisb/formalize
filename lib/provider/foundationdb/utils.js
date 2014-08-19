
/* Modelled on https://github.com/leaflevellabs/node-foundationdblayers/blob/master/lib/utils.js

Copyright (c) 2013 Alex Gadea, All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE
 */

(function() {
  var fdb, packArray, packNumber, packObject, packValue, tuple, unpackArray, unpackValue;

  fdb = require('fdb').apiVersion(200);

  tuple = fdb.tuple;

  packValue = function(val) {
    switch (typeof val) {
      case 'undefined':
        return tuple.pack([0, '']);
      case 'string':
        return tuple.pack([1, new Buffer(val, 'ascii')]);
      case 'number':
        return packNumber(val);
      case 'boolean':
        return tuple.pack([4, (val ? 1 : 0)]);
      default:
        return packObject(val);
    }
  };

  packNumber = function(val) {
    if (val % 1 === 0) {
      return tuple.pack([2, val]);
    } else {
      return tuple.pack([3, new Buffer('' + val, 'ascii')]);
    }
  };

  packObject = function(val) {
    if (val === null) {
      return tuple.pack([5, '']);
    } else if (val instanceof Date) {
      return tuple.pack([6, val.getTime()]);
    } else if (val instanceof Array) {
      return tuple.pack([7, packArray(val)]);
    } else if (val instanceof Object) {
      return tuple.pack([8, new Buffer(JSON.stringify(val), 'ascii')]);
    } else {
      throw new Error("the packValue function only accepts string, number, boolean, date, array and object");
    }
  };

  packArray = function(val) {
    var arr, child, _i, _len;
    arr = [];
    for (_i = 0, _len = val.length; _i < _len; _i++) {
      child = val[_i];
      arr.push(packValue(child));
    }
    return tuple.pack(arr);
  };

  unpackValue = function(val) {
    var type, unpacked;
    if (!val) {
      return null;
    }
    unpacked = tuple.unpack(val);
    type = unpacked[0];
    val = unpacked[1];
    switch (type) {
      case 0:
        break;
      case 1:
        return val.toString('ascii');
      case 2:
        return val;
      case 3:
        return parseFloat(val.toString('ascii'));
      case 4:
        return val === 1;
      case 5:
        return null;
      case 6:
        return new Date(val);
      case 7:
        return unpackArray(val);
      case 8:
        return JSON.parse(val.toString('ascii'));
      default:
        throw new Error("the type (" + type + ") of the passed val is unknown");
    }
  };

  unpackArray = function(val) {
    var arr, child, _i, _len, _ref;
    arr = [];
    _ref = tuple.unpack(val);
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
