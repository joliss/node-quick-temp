require('mocha-as-promised')()
var chai = require('chai')
chai.use(require('chai-as-promised'))
var expect = chai.expect

var RSVP = require('rsvp')
var Promise = RSVP.Promise
var fs = { mkdir: RSVP.denodeify(require('fs').mkdir),
           stat: RSVP.denodeify(require('fs').stat) }
var quickTemp = require('./index.js')
var rimraf = RSVP.denodeify(require('rimraf'))

describe('Unit tests:', function() {

  describe('remove()', function() {
    var thing = { coolDir: 'really-cool-directory' }

    it('should remove an existing directory', function() {

      return Promise.resolve()

      .then(function() { // Create directory manually
        return fs.mkdir(thing.coolDir)
      })

      .then(function() { // Call remove()
        return quickTemp.remove(thing, 'coolDir')
      })

      .then(function() { // Check if removing it worked
        expect(thing).to.have.property('coolDir', null)
        return expect(fs.stat(thing.coolDir)).to.be.rejected
      })

    })
  })


  describe('makeOrReuse()', function() {
    var thing = { awesomeDir: null }

    it('should create a new directory if none exists', function() {

      return Promise.resolve()

      .then(function() { // Make sure directory does not exist before
        return expect(fs.stat(thing.awesomeDir)).to.be.rejected
      })

      .then(function() { // Call makeOrReuse()
        return quickTemp.makeOrReuse(thing, 'awesomeDir')
      })

      .then(function() { // Check if property is set and directory exists
        expect(thing.awesomeDir).to.match(/awesome.*\.tmp/)
        return expect(fs.stat(thing.awesomeDir)).to.be.fulfilled
      })

    })

    it('should reuse the directory if one exists', function() {

      var oldName = thing.awesomeDir;

      return Promise.resolve()

      .then(function() { // Make sure directory does exist before
        return expect(fs.stat(thing.awesomeDir)).to.be.fulfilled
      })

      .then(function() { // Call makeOrReuse()
        return quickTemp.makeOrReuse(thing, 'awesomeDir')
      })

      .then(function() { // Check if property is set and directory exists
        expect(thing.awesomeDir).to.equal(oldName)
      })

    })
  })


  describe('makeOrRemake()', function() {
    var thing = { chilledDir: null }

    it('should create a new directory if none exists', function() {

      return Promise.resolve()

      .then(function() { // Make sure directory does not exist before
        return expect(fs.stat(thing.chilledDir)).to.be.rejected
      })

      .then(function() { // Call makeOrRemake()
        return quickTemp.makeOrRemake(thing, 'chilledDir')
      })

      .then(function() { // Check if property is set and directory exists
        expect(thing.chilledDir).to.match(/chilled.*\.tmp/)
        return expect(fs.stat(thing.chilledDir)).to.be.fulfilled
      })

    })

    it('should also create a new directory if one exists', function() {

      var oldName = thing.chilledDir;

      return Promise.resolve()

      .then(function() { // Make sure directory does exist before
        return expect(fs.stat(thing.chilledDir)).to.be.fulfilled
      })

      .then(function() { // Call makeOrRemake()
        return quickTemp.makeOrRemake(thing, 'chilledDir')
      })

      .then(function() { // Check if property is set and directory exists
        expect(thing.chilledDir).to.match(/chilled.*\.tmp/)
                           .and.not.equal(oldName)
        return expect(fs.stat(thing.chilledDir)).to.be.fulfilled
      })

    })
  })

  after(function() { rimraf('tmp') }) // Cleanup
})
