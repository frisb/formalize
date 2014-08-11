(function() {
  var Schema;

  module.exports = Schema = (function() {
    function Schema(initializer) {
      var d, i, s, sd, _i, _len;
      this.src = [];
      this.dest = [];
      this.map = {};
      if (initializer instanceof Array) {
        for (i = _i = 0, _len = val.length; _i < _len; i = ++_i) {
          sd = val[i];
          this.src.push(sd);
          this.dest.push(sd);
          this.map[sd] = i;
        }
      } else {
        i = 0;
        for (s in initializer) {
          d = initializer[s];
          this.src.push(s);
          this.dest.push(d);
          this.map[d] = i;
          i++;
        }
      }
    }

    return Schema;

  })();

}).call(this);
