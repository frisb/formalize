(function() {
  var Record;

  module.exports = Record = (function() {
    function Record() {
      this.attributes = Object.create(null);
      this.previous = Object.create(null);
      this.changed = [];
      this.isLoaded = false;
      this.isNew = true;
    }

    Record.prototype.get = function(src) {
      var dest;
      dest = this.schema.getDest(src);
      return this.attributes[dest];
    };

    Record.prototype.set = function(src, val) {
      var currentVal, dest;
      if (typeof val !== 'undefined') {
        dest = this.schema.getDest(src);
        currentVal = this.attributes[dest];
        if (currentVal) {
          this.previous[dest] = currentVal;
        }
        this.attributes[dest] = val;
        return this.changed.push(dest);
      }
    };

    return Record;

  })();

}).call(this);
