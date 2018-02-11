# go-loader-git [![npm](https://img.shields.io/npm/v/go-loader-git.svg?style=flat-square)](https://www.npmjs.com/package/go-loader-git) [![Travis](https://img.shields.io/travis/gocli/go-loader-git.svg?style=flat-square)](https://travis-ci.org/gocli/go-loader-git)

[Go](https://www.npmjs.com/package/go) loader for git repositories

## Usage

```bash
$ npm install --global go go-loader-git
$ go git <repository> [destination] [--keep-git]
```

`repository` — is anything that can be processed by [git clone](https://git-scm.com/docs/git-clone).

`destination` — if it is specified, it will be created in case it is not exists yet, and loaded files will be stored in there. If path is not specified, it is extracted from the repository name.

`--keep-git` (`-k`) — do not remove **.git** directory after loading repository.

## Examples

```bash
# in /Users/gocli/

# ensures that /Users/gocli/sources/new-project/ exists and loads files in there
$ go git git@github.com:repository/path.git sources/new-project

# ensures that /Users/gocli/path/ exists and loads files in there
$ go git https://github.com/repository/path.git
```

## License

MIT © [Stanislav Termosa](https://github.com/termosa)

