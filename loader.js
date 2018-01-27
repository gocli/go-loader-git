var download = require('download-github-repo')

var DEFAULT_SERVICE = 'github'
var repositoryRegexp = /^[-_\.\/\w]+(#[^^~:\s\\]+)?$/

var services = {
  github: function loadGithubRepository (repository, dest) {
    return new Promise(function (resolve, reject) {
      console.log('(git) loading sources...')

      download(repository, dest, function (err) {
        if (err) reject(err.toString())
        else resolve({ path: dest })
      })
    })
  }
}

function isValidRepository (repository) {
  if (!repositoryRegexp.test(repository)) return false
  if (!~repository.indexOf('//')) return false
  return true
}

function resolveSource (source) {
  var sep = source.indexOf(':')
  var service = ~sep ? source.slice(0, sep) : DEFAULT_SERVICE
  var repository = ~sep ? source.slice(sep + 1) : source

  if (!services.hasOwnProperty(service)) {
    throw '(git) ' + service + ' service is not supported'
  }

  if (!repository) {
    throw '(git) repository name is required'
  }

  if (isValidRepository(repository)) {
    throw '(git) invalid repository name'
  }

  return {
    service: services[service],
    repository: repository
  }
}


function loadGitRepository (source, argv) {
  try {
    source = resolveSource(source)
  } catch (error) {
    return Promise.reject(error)
  }

  var service = source.service
  var repository = source.repository
  var dest = argv._[1] || source.repository.split('/')[1]

  return service(repository, dest)
    .catch(function (error) {
      throw '(git) can not load ' + repository + ' due to:\n  ' + error.toString()
    })
}

module.exports = loadGitRepository
