var download = require('download-git-repo')

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

module.exports = services
