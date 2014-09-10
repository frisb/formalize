(function() {
  var ProviderFactory, providers;

  providers = {};

  ProviderFactory = {
    create: function(dbType) {
      var Provider;
      Provider = require("./" + dbType);
      return function(dbName, options, callback) {
        var key, provider;
        if (typeof options === 'function') {
          callback = options;
          options = null;
        }
        key = "" + dbType + ":" + dbName;
        provider = providers[key];
        if (!provider) {
          provider = new Provider(dbType, dbName);
          providers[key] = provider;
        }
        if (callback) {
          provider.on('connected', callback);
        }
        provider.connect(options);
        if (!callback) {
          return provider;
        } else {

        }
      };
    }
  };

  module.exports = ProviderFactory;

}).call(this);
