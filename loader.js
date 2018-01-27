var resolveService = require('./lib/resolve-service')
var isValidRepository = require('./lib/is-valid-repository')
var services = require('./lib/services')

function loadGitRepository (argv, prefix) {
  try {
    var service = resolveService(argv, prefix)
  } catch (error) {
    return Promise.reject(error)
  }

  var name = service.name
  var repository = service.repository
  var destination = service.destination

  if (!services.hasOwnProperty(name)) {
    return Promise.reject('(git) ' + name + ' service is not supported')
  }

  if (!repository) {
    return Promise.reject('(git) repository name is required')
  }

  if (!isValidRepository(repository)) {
    return Promise.reject('(git) invalid repository name')
  }

  var load = services[name]
  return load(repository, destination)
    .catch(function (error) {
      throw '(git) can not load ' + name + ':' + repository + ' due to:\n  ' + error.toString()
    })
}

module.exports = loadGitRepository
