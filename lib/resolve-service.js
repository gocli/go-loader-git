var DEFAULT_SERVICE = 'github'

function resolveService (argv, prefix) {
  var args = (prefix ? prefix.split(':') : []).concat(argv._.slice(1))
  var name = !args[0] || ~args[0].indexOf('/') ? DEFAULT_SERVICE : args.shift() || null
  var repository = args.shift() || null
  var destination = args.length ? args[0] : repository && repository.split('/').pop() || null

  return {
    name: name,
    repository: repository,
    destination: destination
  }
}

module.exports = resolveService
