const mockExtractDestination = jest.fn()
jest.mock('../lib/extract-destination', () => mockExtractDestination)
const mockIsGitUrl = jest.fn()
jest.mock('is-git-url', () => mockIsGitUrl)
const mockIsValidTarget = jest.fn()
jest.mock('../lib/is-valid-target', () => mockIsValidTarget)
const mockParseArgs = jest.fn()
jest.mock('../lib/parse-args', () => mockParseArgs)
const mockSetup = jest.fn()
jest.mock('../lib/setup', () => mockSetup)

const loader = require('../lib/loader')

describe('Loader', () => {
  const args = {}
  const repo = 'git@github.com:user/repo.git'
  const dest = 'dest/path'

  beforeEach(() => {
    mockExtractDestination.mockReset()
    mockIsGitUrl.mockReset()
    mockIsValidTarget.mockReset()
    mockParseArgs.mockReset()
    mockSetup.mockReset()

    mockExtractDestination.mockReturnValue(dest)
    mockIsGitUrl.mockReturnValue(true)
    mockIsValidTarget.mockResolvedValue(null)
    mockParseArgs.mockReturnValue({
      _: ['git', repo],
      'keep-git': false,
      install: true
    })
    mockSetup.mockResolvedValue(null)
  })

  it('rejects if repository name is not specified', () => {
    mockParseArgs.mockReturnValue({ _: ['git'] })
    return expect(loader.execute(args))
      .rejects.toThrow('failed to load repository: source is not specified')
  })

  it('rejects if given url is not valid git address', () => {
    mockIsGitUrl.mockReturnValue(false)
    return expect(loader.execute(args))
      .rejects.toThrow('failed to load repository: \'git@github.com:user/repo.git\' is not valid git link')
  })

  it('validates destination given in arguments', () => {
    mockParseArgs.mockReturnValue({ _: ['git', repo, 'test/path'] })
    return loader.execute(args)
      .then(() => {
        expect(mockIsValidTarget).toHaveBeenCalledTimes(1)
        expect(mockIsValidTarget).toHaveBeenCalledWith('test/path')
      })
  })

  it('validates destination extracted from repo source', () => {
    mockParseArgs.mockReturnValue({ _: ['git', repo] })
    mockExtractDestination.mockReturnValue('repo-name')
    return loader.execute(args)
      .then(() => {
        expect(mockIsValidTarget).toHaveBeenCalledTimes(1)
        expect(mockIsValidTarget).toHaveBeenCalledWith('repo-name')
      })
  })

  it('calls to setup with destination given in arguments', () => {
    const argv = { _: ['git', repo, 'test/path'] }
    mockParseArgs.mockReturnValue(argv)
    return loader.execute(args)
      .then(() => {
        expect(mockSetup).toHaveBeenCalledTimes(1)
        expect(mockSetup).toHaveBeenCalledWith(repo, 'test/path', argv)
      })
  })

  it('calls to setup with destination extrcted from repo source', () => {
    const argv = { _: ['git', repo] }
    mockParseArgs.mockReturnValue(argv)
    mockExtractDestination.mockReturnValue('repo-name')
    return loader.execute(args)
      .then(() => {
        expect(mockSetup).toHaveBeenCalledTimes(1)
        expect(mockSetup).toHaveBeenCalledWith(repo, 'repo-name', argv)
      })
  })

  it('resolves with the object containing setup path and install flag', () => {
    return expect(loader.execute(args))
      .resolves.toEqual({ path: dest, install: true })
  })

  it('rejects if isValidTarget() rejects', () => {
    const err = 'validation error'
    mockIsValidTarget.mockRejectedValue(new Error(err))
    return expect(loader.execute(args))
      .rejects.toThrow(`failed to load repository because of '${err}'`)
  })

  it('rejects if setup() rejects', () => {
    const err = 'setup error'
    mockSetup.mockRejectedValue(new Error(err))
    return expect(loader.execute(args))
      .rejects.toThrow(`failed to load repository because of '${err}'`)
  })
})
