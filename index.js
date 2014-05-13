var fs = require('fs')
var path = require('path')
var mktemp = require('mktemp')
var rimraf = require('rimraf')
var underscoreString = require('underscore.string')

exports.makeOrRemake = makeOrRemake
function makeOrRemake(obj, prop) {
  if (obj[prop] != null) {
    remove(obj, prop)
  }
  return obj[prop] = makeTmpDir(obj.constructor && obj.constructor.name || '', prop)
}

exports.makeOrReuse = makeOrReuse
function makeOrReuse(obj, prop) {
  if (obj[prop] != null) {
    return obj[prop]
  }
  return obj[prop] = makeTmpDir(obj.constructor && obj.constructor.name || '', prop)
}

exports.remove = remove
function remove(obj, prop) {
  if (obj[prop] != null) {
    rimraf.sync(obj[prop])
  }
  obj[prop] = null
}


function makeTmpDir(name, prop) {
  findBaseDir()
  var tmpDirName = prettyTmpDirName(name, prop)
  return mktemp.createDirSync(path.join(baseDir, tmpDirName))
}

var baseDir

function findBaseDir () {
  if (baseDir == null) {
    try {
      if (fs.statSync('tmp').isDirectory()) {
        baseDir = fs.realpathSync('tmp')
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      // We could try other directories, but for now we just create ./tmp if
      // it doesn't exist
      fs.mkdirSync('tmp')
      baseDir = fs.realpathSync('tmp')
    }
  }
}

function cleanString (s) {
  return underscoreString.underscored(s || '')
    .replace(/[^a-z_]/g, '')
    .replace(/^_+/, '')
}

function prettyTmpDirName (name, prop) {
  var cleanObjectName = cleanString(name)
  if (cleanObjectName === 'object') cleanObjectName = ''
  if (cleanObjectName) cleanObjectName += '-'
  var cleanPropertyName = cleanString(prop)
  return cleanObjectName + cleanPropertyName + '-XXXXXXXX.tmp'
}
