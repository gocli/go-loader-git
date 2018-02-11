import rimraf from 'rimraf'
import { sep } from 'path'
import clone from './clone'
import canBeTarget from './can-be-target'
import fail from './fail'

const extractDestination = (repository) => {
  const name = (repository.match(/(^|:|\/)([^/:]+)\/*(.git)?\/*$/i) || [])[2] || ''
  if (!name.endsWith('.git')) return name
  return name.slice(0, -4)
}

const removeGit = (destination, argv) =>
  new Promise((resolve, reject) => {
    if (argv['keep-git'] || argv['k']) return resolve()

    rimraf(destination + sep + '.git', (error) => {
      if (error) reject(error)
      else resolve()
    })
  })

const loadGitRepository = (commandString, argv) => {
  const repository = argv._[1]
  if (!repository) {
    return Promise.reject(fail(`failed to load repository\n Source is not specified`))
  }

  const destination = argv._[2] || extractDestination(repository)

  return canBeTarget(destination)
    .then(() => console.log(`(git) loading ${repository}`))
    .then(() => clone(repository, destination, argv))
    .then(() => console.log(`(git) repository loaded to ${destination}`))
    .then(() => removeGit(destination, argv))
    .then(() => ({ path: destination }))
    .catch((error) => {
      throw fail(`failed to load repository\n ${error.message}`)
    })
}

export default loadGitRepository
