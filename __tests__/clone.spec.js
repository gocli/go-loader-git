const mockSpawn = jest.fn()
jest.mock('child_process', () => ({ spawn: mockSpawn }))

const EventEmitter = require('events')
const clone = require('../lib/clone')

describe('Clone', () => {
  const repo = 'git@github.com:name/repo.git'
  const target = 'destination/target'
  const gitBin = 'git'

  beforeEach(() => {
    mockSpawn.mockReset()
  })

  it('spawns git clone', () => {
    const ee = new EventEmitter()
    mockSpawn.mockReturnValue(ee)
    setTimeout(() => ee.emit('close', 0))
    return clone(repo)
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(1)
        expect(mockSpawn).toHaveBeenCalledWith(gitBin, ['clone', '--depth', 1, '--', repo])
      })
  })

  it('spawns git clone with destination target', () => {
    const ee = new EventEmitter()
    mockSpawn.mockReturnValue(ee)
    setTimeout(() => ee.emit('close', 0))
    return clone(repo, target)
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(1)
        expect(mockSpawn).toHaveBeenCalledWith(gitBin, ['clone', '--depth', 1, '--', repo, target])
      })
  })

  it('clones all history if keep-git is truthy', () => {
    const ee = new EventEmitter()
    mockSpawn.mockReturnValue(ee)
    setTimeout(() => ee.emit('close', 0))
    return clone(repo, target, { 'keep-git': true })
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(1)
        expect(mockSpawn).toHaveBeenCalledWith(gitBin, ['clone', '--', repo, target])
      })
  })

  it('clones all history if depth flag is falsy', () => {
    const ee = new EventEmitter()
    mockSpawn.mockReturnValue(ee)
    setTimeout(() => ee.emit('close', 0))
    return clone(repo, target, { 'depth': false })
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(1)
        expect(mockSpawn).toHaveBeenCalledWith(gitBin, ['clone', '--', repo, target])
      })
  })

  it('clones all history if checkout flag is setted', () => {
    const ee = new EventEmitter()
    const ee2 = new EventEmitter()
    mockSpawn.mockReturnValueOnce(ee)
    setTimeout(() => {
      mockSpawn.mockReturnValueOnce(ee2)
      ee.emit('close', 0)
      setTimeout(() => ee2.emit('close', 0))
    })
    return clone(repo, target, { 'checkout': 'tag' })
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(2)
        expect(mockSpawn).toHaveBeenCalledWith(gitBin, ['clone', '--', repo, target])
      })
  })

  it('handles depth option', () => {
    const ee = new EventEmitter()
    mockSpawn.mockReturnValue(ee)
    setTimeout(() => ee.emit('close', 0))
    return clone(repo, null, { depth: 2 })
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(1)
        expect(mockSpawn).toHaveBeenCalledWith(gitBin, ['clone', '--depth', 2, '--', repo])
      })
  })

  it('ignores keep-git if depth is setted', () => {
    const ee = new EventEmitter()
    mockSpawn.mockReturnValue(ee)
    setTimeout(() => ee.emit('close', 0))
    return clone(repo, null, { depth: 2, 'keep-git': false })
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(1)
        expect(mockSpawn).toHaveBeenCalledWith(gitBin, ['clone', '--depth', 2, '--', repo])
      })
  })

  it('handles both: keep-git and depth', () => {
    const ee = new EventEmitter()
    mockSpawn.mockReturnValue(ee)
    setTimeout(() => ee.emit('close', 0))
    return clone(repo, null, { depth: 2, 'keep-git': true })
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(1)
        expect(mockSpawn).toHaveBeenCalledWith(gitBin, ['clone', '--depth', 2, '--', repo])
      })
  })

  it('uses custom git binary', () => {
    const ee = new EventEmitter()
    mockSpawn.mockReturnValue(ee)
    setTimeout(() => ee.emit('close', 0))
    return clone(repo, null, { git: '/usr/bin/git', 'keep-git': true })
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(1)
        expect(mockSpawn).toHaveBeenCalledWith('/usr/bin/git', ['clone', '--', repo])
      })
  })

  it('rejects if exit code is not 0', () => {
    const ee = new EventEmitter()
    mockSpawn.mockReturnValue(ee)
    setTimeout(() => ee.emit('close', 1))
    return expect(clone(repo)).rejects
      .toThrow('\'git clone --depth 1 -- git@github.com:name/repo.git\' failed with status 1')
  })

  it('successfully checkouts', () => {
    const ee = new EventEmitter()
    const ee2 = new EventEmitter()
    mockSpawn.mockReturnValueOnce(ee)
    setTimeout(() => {
      mockSpawn.mockReturnValueOnce(ee2)
      ee.emit('close', 0)
      setTimeout(() => ee2.emit('close', 0))
    })
    return clone(repo, target, { checkout: 'branch' })
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(2)
        expect(mockSpawn).toHaveBeenLastCalledWith(
          gitBin,
          ['checkout', 'branch'],
          { cwd: target }
        )
      })
  })

  it('successfully checkouts using custom bin', () => {
    const ee = new EventEmitter()
    const ee2 = new EventEmitter()
    mockSpawn.mockReturnValueOnce(ee)
    setTimeout(() => {
      mockSpawn.mockReturnValueOnce(ee2)
      ee.emit('close', 0)
      setTimeout(() => ee2.emit('close', 0))
    })
    return clone(repo, target, { checkout: 'branch', git: '/usr/bin/go' })
      .then(() => {
        expect(mockSpawn).toHaveBeenCalledTimes(2)
        expect(mockSpawn).toHaveBeenLastCalledWith(
          '/usr/bin/go',
          ['checkout', 'branch'],
          { cwd: target }
        )
      })
  })

  it('rejects if checkout has failed', () => {
    const ee = new EventEmitter()
    const ee2 = new EventEmitter()
    mockSpawn.mockReturnValueOnce(ee)
    setTimeout(() => {
      mockSpawn.mockReturnValueOnce(ee2)
      ee.emit('close', 0)
      setTimeout(() => ee2.emit('close', 1))
    })
    return expect(clone(repo, target, { checkout: 'branch' }))
      .rejects.toThrow('\'git checkout branch\' failed with status 1')
  })
})
