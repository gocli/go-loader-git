var download = require('download-git-repo')

var DEFAULT_SERVICE = 'github'
var repositoryRegexp = /^[-_\.\w]+\/[-_\.\/\w]*[-_\.\w]+(#[^^~:\s\\]+)?$/

function load (service, repository, dest) {
  return new Promise(function (resolve, reject) {
    console.log('(git) loading sources...')

    download(service + ':' + repository, dest, function (err) {
      if (err) reject(err)
      else resolve({ path: dest })
    })
  })
}

var services = {
  github: load.bind(null, 'github'),
  bitbucket: load.bind(null, 'bitbucket'),
  gitlab: load.bind(null, 'gitlab')
}

function isValidRepository (repository) {
  if (!repositoryRegexp.test(repository)) return false
  if (~repository.indexOf('//')) return false
  return true
}

function resolveService (source, argv) {
  source = source || ''
  var sep = source.indexOf(':')
  var service = ~sep ? source.slice(0, sep) : DEFAULT_SERVICE
  var repository = ~sep ? source.slice(sep + 1) : source

  if (!services.hasOwnProperty(service)) {
    throw '(git) ' + service + ' service is not supported'
  }

  if (!repository) {
    throw '(git) repository name is required'
  }

  if (!isValidRepository(repository)) {
    throw '(git) invalid repository name'
  }

  return {
    name: service,
    service: services[service],
    repository: repository
  }
}


function loadGitRepository (source, argv) {
  console.log({ argv, source })
  try {
    source = resolveService(source, argv)
  } catch (error) {
    return Promise.reject(error)
  }

  var service = source.service
  var serviceName = source.name
  var repository = source.repository
  var dest = argv._[1] || source.repository.split('/')[1]

  return service(repository, dest)
    .catch(function (error) {
      throw '(git) can not load ' + serviceName + ':' + repository + ' due to:\n  ' + error.toString()
    })
}

module.exports = loadGitRepository
