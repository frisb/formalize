(function() {
  var EventEmitter, Provider,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  module.exports = Provider = (function(_super) {
    __extends(Provider, _super);

    function Provider(name) {
      this.name = name;
      this.ActiveRecord = require('../activerecord')(this);
      this.status = 'disconnected';
      this.db = null;
    }

    Provider.prototype.connect = function(options) {
      var callback;
      switch (this.status) {
        case 'connected':
          this.emit('connected', this);
          break;
        case 'disconnected':
          this.status = 'connecting';
          callback = (function(_this) {
            return function(db) {
              _this.status = 'connected';
              _this.db = db;
              return _this.emit('connected', _this);
            };
          })(this);
          this.init(options, callback);
      }
      return this;
    };

    Provider.prototype.init = function(options, callback) {
      throw new Error('not implemented');
    };

    Provider.prototype.getIdGenerator = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    Provider.prototype.getLoadFunction = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    Provider.prototype.getSaveFunction = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    Provider.prototype.getConstructFunction = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    Provider.prototype.getAllFunction = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    Provider.prototype.getFetchFunction = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    Provider.prototype.getIncrementCountFunction = function(ActiveCounter) {
      throw new Error('not implemented');
    };

    Provider.prototype.getGetCountFunction = function(ActiveCounter) {
      throw new Error('not implemented');
    };

    Provider.prototype.loadSchema = function(ActiveRecord, callback) {
      throw new Error('not implemented');
    };

    Provider.prototype.saveSchema = function(ActiveRecord, initializer, callback) {
      throw new Error('not implemented');
    };

    return Provider;

  })(EventEmitter);

}).call(this);
