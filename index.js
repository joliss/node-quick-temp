var fs = require('fs')
var path = require('path')
var mktemp = require('mktemp')
var rimraf = require('rimraf')

exports.makeOrRemake = makeOrRemake
function makeOrRemake(obj, prop) {
  if (obj[prop] != null) {
    remove(obj, prop)
  }
  return obj[prop] = makeTmpDir(obj, prop)
}

exports.makeOrReuse = makeOrReuse
function makeOrReuse(obj, prop) {
  if (obj[prop] != null) {
    return obj[prop]
  }
  return obj[prop] = makeTmpDir(obj, prop)
}

exports.remove = remove
function remove(obj, prop) {
  if (obj[prop] == null) {
    throw new Error('Expected "' + prop + '" on ' + obj + ' to contain path of temporary directory')
  }
  rimraf.sync(obj[prop])
  obj[prop] = null
}


var baseDir

function makeTmpDir(obj, prop) {
  if (baseDir == null) {
    try {
      if (fs.statSync('tmp').isDirectory()) {
        baseDir = 'tmp'
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      // We could try other directories, but for now we just create ./tmp if
      // it doesn't exist
      fs.mkdirSync('tmp')
      baseDir = 'tmp'
    }
  }

  // Will use obj.constructor.name and prop in the future to construct a
  // "nice" name
  var tmpDirName = 'XXXXXXXX.tmp'

  return mktemp.createDirSync(path.join(baseDir, tmpDirName))
}
