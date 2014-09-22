(function() {
  var Debug, Writeln, jsonShrink, surreal, writelns;

  surreal = require('surreal');

  Writeln = require('writeln');

  writelns = {};

  jsonShrink = function(s) {
    if (typeof s !== 'string') {
      s = surreal.serialize(s, 2);
    }
    if (s[0] === '{' && s[s.length - 1] === '}') {
      s = s.substr(1, s.length - 2);
    }
    return s;
  };

  module.exports = Debug = (function() {
    function Debug(isActive) {
      this.isActive = isActive;
      this.buf = null;
    }

    Debug.prototype.buffer = function(description, data, transformer, scope) {
      if (this.isActive) {
        if (this.buf === null) {
          this.buf = Object.create(null);
        }
        if (transformer) {
          data = transformer.call(scope || this, data);
        }
        return this.buf[description] = data;
      }
    };

    Debug.prototype.log = function(category, text) {
      var metadata, writeln;
      writeln = writelns[category];
      if (!writeln) {
        writeln = new Writeln(category);
        writelns[category] = writeln;
      }
      if (this.buf !== null) {
        metadata = jsonShrink(this.buf);
        this.buf = null;
      }
      return writeln.debug(text, metadata);
    };

    return Debug;

  })();

}).call(this);
