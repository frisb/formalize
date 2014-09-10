(function() {
  var ActiveMechanism, Mechanism, mechanisms, objectToArray;

  mechanisms = {};

  Mechanism = (function() {
    function Mechanism(mechanism) {
      this.name = mechanism.name;
      this.key = mechanism.key;
      this.filter = mechanism.filter;
      this.value = mechanism.value;
    }

    return Mechanism;

  })();

  ActiveMechanism = (function() {
    function ActiveMechanism(initializer) {
      this.init(initializer);
    }

    ActiveMechanism.prototype.init = function(initializer) {
      var index, mechanism, _i, _len, _ref, _results;
      this.initializer = initializer;
      if (this.initializer) {
        this.items = [];
        _ref = this.initializer;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mechanism = _ref[_i];
          index = new Mechanism(mechanism);
          this.items.push(mechanism);
          _results.push(this[mechanism.name] = mechanism);
        }
        return _results;
      }
    };

    return ActiveMechanism;

  })();

  objectToArray = function(obj) {
    var arr, k, v;
    arr = [];
    for (k in obj) {
      v = obj[k];
      v.name = k;
      arr.push(v);
    }
    return arr;
  };

  module.exports = function(typeName, mechanismName, options) {
    var initializer, key, mech;
    key = "" + this.dbType + ":" + this.dbName + ":" + typeName + ":" + mechanismName;
    mech = mechanisms[key];
    if (!mech && options[mechanismName]) {
      initializer = options[mechanismName];
      if (!(initializer instanceof Array)) {
        initializer = objectToArray(initializer);
      }
      mech = new ActiveMechanism(initializer);
      return mechanisms[key] = mech;
    } else {
      return mech;
    }
  };

}).call(this);
