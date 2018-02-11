import { spawn } from 'child_process'
import fail from './fail'

const GIT_BINARY = 'git'

const checkout = (git, target, link) =>
  new Promise((resolve, reject) => {
    const args = ['checkout', link]
    spawn(git, args, { cwd: target })
      .on('close', (statusCode) => {
        if (!statusCode) resolve()
        else reject(fail(`'git checkout' failed with status ${statusCode}`))
      })
  })

const clone = (repo, target = null, opts = {}) =>
  new Promise((resolve, reject) => {
    if (target && typeof target === 'object') {
      opts = target
      target = null
    }

    const git = opts.git || GIT_BINARY
    const args = ['clone']

    if (opts.shallow) {
      args.push('--depth')
      args.push('1')
    }

    args.push('--')
    args.push(repo)

    if (target) {
      args.push(target)
    }

    spawn(git, args)
      .on('close', (statusCode) => {
        if (statusCode) reject(fail(`'git clone' failed with status ${statusCode}`))
        else if (opts.checkout) resolve(checkout(git, target, opts.checkout))
        else resolve()
      })
  })

export default clone
