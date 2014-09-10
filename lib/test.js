(function() {
  var Test, test;

  Test = (function() {
    function Test() {
      console.log(this.hello());
      console.log(Test.hello());
    }

    Test.prototype.hello = function() {
      return this.wow;
    };

    Test.hello = function() {
      return this.prototype.hello();
    };

    Object.defineProperty(Test.prototype, 'wow', {
      get: function() {
        return 1;
      }
    });

    return Test;

  })();

  test = new Test();

}).call(this);
