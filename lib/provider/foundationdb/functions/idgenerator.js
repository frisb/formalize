(function() {
  var ObjectID;

  ObjectID = require('bson').ObjectID;

  module.exports = function(ActiveRecord) {
    return function() {
      return new ObjectID().toHexString();
    };
  };

}).call(this);
