(function() {
  var Adapter;

  module.exports = Adapter = (function() {
    function Adapter(dbType) {
      this.dbType = dbType;
      this.db = require("./" + this.dbType + "/db");
      this.getIdGenerator = require("./" + this.dbType + "/functions/idgenerator");
      this.getLoadFunction = require("./" + this.dbType + "/functions/load");
      this.getSaveFunction = require("./" + this.dbType + "/functions/save");
      this.getAllFunction = require("./" + this.dbType + "/functions/all");
      this.getFetchFunction = require("./" + this.dbType + "/functions/fetch");
    }

    return Adapter;

  })();

}).call(this);
