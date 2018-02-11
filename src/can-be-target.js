import fs from 'fs'
import fail from './fail'

const canBeTarget = (path) =>
  new Promise((resolve, reject) => {
    fs.stat(path, (error, stat) => {
      if (error) return resolve()

      const checkContent = (error, data) => {
        if (error) return resolve()

        if (!data || !data.length) resolve()
        else reject(fail(`'${path}' can't be used as a target folder, make sure it is empty`))
      }

      if (stat.isDirectory()) {
        fs.readdir(path, checkContent)
      } else {
        fs.readFile(path, checkContent)
      }
    })
  })

export default canBeTarget
