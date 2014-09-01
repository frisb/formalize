module.exports = (ActiveRecord) ->
  start = @getStartFunction(ActiveRecord)

  ->
    start (provider) =>
      @subspace = provider.dir.counters.subspace([@name])
