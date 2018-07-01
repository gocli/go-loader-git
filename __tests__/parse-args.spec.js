const parseArgs = require('../lib/parse-args')

describe('Parse Arguments', () => {
  it('handles empty list without fail', () => {
    expect(parseArgs()).toMatchSnapshot()
  })

  it('handles all flags', () => {
    expect(parseArgs('c m d --depth 3 --checkout dev --git /bin/git --keep-git'.split(' '))).toMatchSnapshot()
  })

  it('handles alias for keep-git', () => {
    expect(parseArgs(['cmd', '-k'])).toMatchSnapshot()
  })

  it('handles no-install flag', () => {
    expect(parseArgs(['cmd', '--no-install'])).toMatchSnapshot()
  })
})
