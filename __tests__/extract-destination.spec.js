const extractDestination = require('../lib/extract-destination')

describe('Extract Destination', () => {
  it('extracts the name out of git ssh link', () => {
    expect(extractDestination('git@github.com:gocli/go-cli.git'))
      .toBe('go-cli')
  })

  it('extracts the name out of git https link', () => {
    expect(extractDestination('https://github.com/gocli/go-loader-git.git'))
      .toBe('go-loader-git')
  })

  it('extracts the name out of the link without git extension', () => {
    expect(extractDestination('https://termosa@bitbucket.org/some.awkward/repository-name'))
      .toBe('repository-name')
  })
})
