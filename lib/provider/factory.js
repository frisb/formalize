(function() {
  var ProviderFactory, providers;

  providers = {};

  ProviderFactory = {
    create: function(dbType) {
      var Provider;
      Provider = require("./" + dbType);
      return function(name, options, callback) {
        var dbKey, provider;
        if (typeof options === 'function') {
          callback = options;
          options = null;
        }
        dbKey = "" + dbType + ":" + name;
        provider = providers[dbKey];
        if (!provider) {
          provider = new Provider(name);
          providers[dbKey] = provider;
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
