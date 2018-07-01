const mockClone = jest.fn()
jest.mock('../lib/clone', () => mockClone)
const mockRimraf = jest.fn()
jest.mock('rimraf', () => mockRimraf)
const mockLog = jest.fn()
jest.mock('../lib/log', () => mockLog)

const { sep } = require('path')
const setup = require('../lib/setup')

describe('Setup', () => {
  const repo = 'git@github.com:user:repo.git'
  const dest = 'prj/path'
  const argv = {}

  beforeEach(() => {
    mockClone.mockReset()
    mockRimraf.mockReset()
    mockLog.mockReset()

    mockClone.mockResolvedValue(null)
    mockRimraf.mockImplementation((p, cb) => cb(null))
  })

  it('resolves if clone & rimraf resolves', () => {
    return expect(setup(repo, dest, argv)).resolves.toBe(undefined)
  })

  it('calls to clone and rimraf', () => {
    return setup(repo, dest, argv)
      .then(() => {
        expect(mockClone).toHaveBeenCalledTimes(1)
        expect(mockClone).toHaveBeenCalledWith(repo, dest, argv)

        expect(mockRimraf).toHaveBeenCalledTimes(1)
        expect(mockRimraf.mock.calls[0][0]).toBe(dest + sep + '.git')
      })
  })

  it('does not call to rimraf if keep-alive is truthy', () => {
    return setup(repo, dest, { 'keep-git': true })
      .then(() => {
        expect(mockClone).toHaveBeenCalledTimes(1)
        expect(mockClone).toHaveBeenCalledWith(repo, dest, { 'keep-git': true })

        expect(mockRimraf).not.toHaveBeenCalled()
      })
  })

  it('does not call to rimraf if depth is presented', () => {
    return setup(repo, dest, { depth: 2 })
      .then(() => {
        expect(mockClone).toHaveBeenCalledTimes(1)
        expect(mockClone).toHaveBeenCalledWith(repo, dest, { depth: 2 })

        expect(mockRimraf).not.toHaveBeenCalled()
      })
  })

  it('rejects if rimraf fails', () => {
    mockRimraf.mockImplementation((p, cb) => cb(new Error('rimraf error')))
    return expect(setup(repo, dest, {})).rejects.toThrow('rimraf error')
  })
})
