const log = require('../lib/log')

describe('Log', () => {
  it('is console.log actually', () => {
    expect(log).toBe(console.log)
  })
})
