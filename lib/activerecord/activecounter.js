(function() {
  var ActiveCounter, Counter;

  Counter = (function() {
    function Counter(counter) {
      this.name = counter.name;
      this.key = counter.key;
      this.filter = counter.filter;
    }

    return Counter;

  })();

  module.exports = ActiveCounter = (function() {
    function ActiveCounter(initializer) {
      this.init(initializer);
    }

    ActiveCounter.prototype.init = function(initializer) {
      var counter, _i, _len, _ref, _results;
      this.initializer = initializer;
      if (this.initializer) {
        this.items = [];
        _ref = this.initializer;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          counter = _ref[_i];
          counter = new Counter(counter);
          this.items.push(counter);
          _results.push(this[counter.name] = counter);
        }
        return _results;
      }
    };

    return ActiveCounter;

  })();

}).call(this);
