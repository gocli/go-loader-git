var repositoryRegexp = /^[-_\.\w]+\/[-_\.\/\w]*[-_\.\w]+(#[^^~:\s\\]+)?$/

function isValidRepository (repository) {
  if (!repositoryRegexp.test(repository)) return false
  if (~repository.indexOf('//')) return false
  return true
}

module.exports = isValidRepository
