(function() {
  module.exports = function(db) {
    return function(name, key) {
      var ActiveCounter;
      return ActiveCounter = (function() {
        function ActiveCounter() {}

        ActiveCounter.name = name;

        ActiveCounter.key = key;

        ActiveCounter.prototype.increment = db.getIncrementCountFunction(ActiveCounter);

        ActiveCounter.prototype.get = db.getGetCountFunction(ActiveCounter);

        return ActiveCounter;

      })();
    };
  };

}).call(this);
