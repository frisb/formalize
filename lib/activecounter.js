(function() {
  module.exports = function(provider, ActiveRecord, options) {
    var ActiveCounter, Counter, activeCounter, counters, objectToArray;
    Counter = (function() {
      function Counter(counter) {
        this.name = counter.name;
        this.key = counter.key;
        this.filter = counter.filter;
        this.transform();
      }

      Counter.prototype.transform = provider.getTransformCounterFunction(ActiveRecord);

      Counter.prototype.increment = provider.getIncrementFunction(ActiveRecord);

      return Counter;

    })();
    ActiveCounter = (function() {
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
    objectToArray = function(obj) {
      var arr, counter, counterName;
      arr = [];
      for (counterName in obj) {
        counter = obj[counterName];
        counter.name = counterName;
        arr.push(counter);
      }
      return arr;
    };
    if (options.counters) {
      counters = !(options.counters instanceof Array) ? objectToArray(options.counters) : options.counters;
      activeCounter = new ActiveCounter(counters);
      ActiveRecord.prototype.counters = activeCounter;
      return ActiveRecord.count = provider.getCountFunction(ActiveRecord, activeCounter);
    }
  };

}).call(this);
