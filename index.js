var path = require('path')
var underscoreString = require('underscore.string')
var RSVP = require('rsvp')
var Promise = RSVP.Promise
var rimraf = RSVP.denodeify(require('rimraf'))
var mktemp = { createDir: RSVP.denodeify(require('mktemp').createDir) }
var fs = { mkdir: RSVP.denodeify(require('fs').mkdir),
           stat: RSVP.denodeify(require('fs').stat) }

exports.makeOrReuse = makeOrReuse
function makeOrReuse(obj, prop) {
  return Promise.resolve(obj[prop] || makeTmpDir(obj, prop))
         .then(function(path) { return obj[prop] = path })
}

exports.makeOrRemake = makeOrRemake
function makeOrRemake(obj, prop) {
  return remove(obj, prop)
         .then(function() { return makeOrReuse(obj, prop) })
}

exports.remove = remove
function remove(obj, prop) {
  return obj[prop] ?
           rimraf(obj[prop]).then(function() { obj[prop] = null }) :
           Promise.resolve()
}


function makeTmpDir(obj, prop) {
  return createBaseDirIfNecessary()
         .then(function() {
            var tmpDirName = prettyTmpDirName(obj, prop)
            return mktemp.createDir(path.join(baseDir, tmpDirName))
         })
}

var baseDir

function createBaseDirIfNecessary () {
  if (baseDir) {
    return Promise.resolve()
  } else {
    return fs.stat('tmp')
           .then(function(stat) {
             if (stat.isDirectory()) { baseDir = 'tmp' }
           })
           .catch(function(err) {
             if (err.code === 'ENOENT') {
               // We could try other directories, but for now we just create ./tmp if
               // it doesn't exist
               return fs.mkdir('tmp').then(function() { baseDir = 'tmp' })
             } else { throw err }
           })
  }
}

function prettyTmpDirName (obj, prop) {
  function cleanString (s) {
    return underscoreString.underscored(s || '')
      .replace(/[^a-z_]/g, '')
      .replace(/^_+/, '')
  }

  var cleanObjectName = cleanString(obj.constructor && obj.constructor.name)
  if (cleanObjectName) cleanObjectName += '-'
  var cleanPropertyName = cleanString(prop)
  return cleanObjectName + cleanPropertyName + '-XXXXXXXX.tmp'
}
