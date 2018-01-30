var DEFAULT_SERVICE = 'github'

function extractDestination (repository) {
  return repository.split('/').pop().split('#').shift()
}

function resolveService (argv, prefix) {
  var args = (prefix ? [prefix] : []).concat(argv._.slice(1)).join(':').split(':')
  var name = !args[0] || ~args[0].indexOf('/') ? DEFAULT_SERVICE : args.shift() || null
  var repository = args.shift() || null
  var destination = args.length
    ? args[0] : repository && extractDestination(repository) || null

  return {
    name: name,
    repository: repository,
    destination: destination
  }
}

module.exports = resolveService
