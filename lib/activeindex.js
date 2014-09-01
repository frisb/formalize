(function() {
  module.exports = function(provider, ActiveRecord, options) {
    var ActiveIndex, Index, activeIndex, indexes, objectToArray;
    Index = (function() {
      function Index(index) {
        this.name = index.name;
        this.key = index.key;
        this.filter = index.filter;
        this.transform();
      }

      Index.prototype.transform = provider.getTransformIndexFunction(ActiveRecord);

      Index.prototype.add = provider.getIndexAddFunction(ActiveRecord);

      return Index;

    })();
    ActiveIndex = (function() {
      function ActiveIndex(initializer) {
        this.init(initializer);
      }

      ActiveIndex.prototype.init = function(initializer) {
        var index, _i, _len, _ref, _results;
        this.initializer = initializer;
        if (this.initializer) {
          this.items = [];
          _ref = this.initializer;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            index = _ref[_i];
            index = new Index(index);
            this.items.push(index);
            _results.push(this[index.name] = index);
          }
          return _results;
        }
      };

      return ActiveIndex;

    })();
    objectToArray = function(obj) {
      var arr, index, indexName;
      arr = [];
      for (indexName in obj) {
        index = obj[indexName];
        index.name = indexName;
        arr.push(index);
      }
      return arr;
    };
    if (options.indexes) {
      indexes = !(options.indexes instanceof Array) ? objectToArray(options.indexes) : options.indexes;
      activeIndex = new ActiveIndex(indexes);
      return ActiveRecord.prototype.indexes = activeIndex;
    }
  };

}).call(this);
