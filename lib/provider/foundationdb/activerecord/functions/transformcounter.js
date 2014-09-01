(function() {
  module.exports = function(ActiveRecord) {
    var start;
    start = this.getStartFunction(ActiveRecord);
    return function() {
      return start((function(_this) {
        return function(provider) {
          return _this.subspace = provider.dir.counters.subspace([_this.name]);
        };
      })(this));
    };
  };

}).call(this);
