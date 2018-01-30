# go-loader-git [![npm](https://img.shields.io/npm/v/go-loader-git.svg?style=flat-square)](https://www.npmjs.com/package/go-loader-git)

[Go](https://www.npmjs.com/package/go) loader for git repositories

## Usage

```bash
$ npm install --global go go-loader-git
$ go :git [service] repo/name [dest]
```

### Services

You can use one of 3 git hosts:

- GitHub: `$ go :git github repo/name`
- Bitbucket: `$ go :git bitbucket repo/name`
- GitLab: `$ go :git gitlab repo/name`

If you avoid using service name in a command — **github** will be used by default.

### Syntax

This plugin supports two syntaxes, colon and spaced:

```bash
# both commands does the same job
$ go :git bitbucket repo/name dest
$ go :git:bitbucket:repo/name:dest
```

And they can be mixed...

```bash
$ go :git:github repo/name
$ go :git gitlab:repo/name
$ go :git:repo/name # github service will be used as a default value
$ go :git:repo/name dest
```

Tag, branch or commit can be specified as a part of repository name (**master** is loaded by default):

```bash
$ go :git repo/name#v3 dest/path
$ go :git bitbucket:repo/name#dev
```

### Destination folder

If destination path is specified, it will be created in case it is not exists yet, and loaded files will be stored in there. And if path is not specified, it is extracted out of the repository name.

```bash
# in /Users/gocli/

# ensures that /Users/gocli/sources/new-project/ exists and loads files in there
$ go :git username/repository-name sources/new-project

# ensures that /Users/gocli/repository-name/ exists and loads files in there
$ go :git username/repository-name
```

## License

MIT © [Stanislav Termosa](https://github.com/termosa)

