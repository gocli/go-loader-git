class GitLoaderError extends Error {
  constructor (error) {
    const message = error instanceof Error ? error.message : error ? error.toString() : error
    super(message)

    this.name = 'GitLoaderError'
    this.message = message
  }
}

const fail = (message) => new GitLoaderError(message)

export default fail
export { GitLoaderError }
