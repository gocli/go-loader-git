import buble from 'rollup-plugin-buble'
import standard from 'rollup-plugin-standard'

export default {
  entry: 'src/loader.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    standard(),
    buble({ objectAssign: 'Object.assign' })
  ]
}
