const fs = require('fs')
const rollup = require('rollup').rollup
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const meta = require('../package.json')

const banner = `/*!
 * ${meta.name} v${meta.version}
 * ${meta.homepage}
 *
 * @license
 * Copyright (c) 2016 ${meta.author}
 * Released under the MIT license
 * ${meta.homepage}/blob/master/LICENSE
 */`

const moduleName = 'VueVNodeHelper'

const config = {
  entry: 'lib/index.js',
  plugins: []
}

mkdirIfNotExists('dist')

rollup(config)
  .then(bundle => {
    return write(bundle, `dist/${meta.name}.common.js`, {
      format: 'cjs',
      banner
    })
  })
  .then(() => rollup(addPlugins(config, [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ])))
  .then(bundle => write(bundle, `dist/${meta.name}.js`, {
    format: 'umd',
    banner,
    moduleName
  }))
  .then(() => rollup(addPlugins(config, [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    uglify({
      output: {
        comments: function(node, comment) {
          const text = comment.value;
          const type = comment.type;
          if (type == "comment2") {
            // multiline comment
            return /@preserve|@license|@cc_on/i.test(text);
          }
        }
      }
    })
  ])))
  .then(bundle => write(bundle, `dist/${meta.name}.min.js`, {
    format: 'umd',
    banner,
    moduleName
  }))
  .then(() => {
    const configCloneNode = Object.assign({}, config, {
      entry: 'lib/clone-node.js'
    })
    return rollup(configCloneNode)
  })
  .then(bundle => write(bundle, 'clone-node.js', {
    format: 'cjs',
    banner
  }))
  .catch(error => {
    console.error(error)
  })

function addPlugins(config, plugins) {
  return Object.assign({}, config, {
    plugins: config.plugins.concat(plugins)
  })
}

function mkdirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }
}

function write(bundle, dest, config) {
  const code = bundle.generate(config).code
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, code, error => {
      if (error) return reject(error)
      console.log(green(dest) + ' ' + size(code))
      resolve()
    })
  })
}

function green(str) {
  return `\x1b[32m${str}\x1b[0m`
}

function size(str) {
  return (str.length / 1024).toFixed(2) + 'kb'
}
