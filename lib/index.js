(function() {
  var ProviderFactory;

  ProviderFactory = require('./provider/factory');

  module.exports = ProviderFactory.create('foundationdb');

}).call(this);
