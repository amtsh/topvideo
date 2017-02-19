var YoutubeAPI = require('../../api/YoutubeAPI')
var Cache = require('../../lib/RedisCache')
var flatHelper = require('../../helpers/flatHelper')
var Q = require('q')

function Regions () {
  var key = 'i18nRegions'

  this.get = function () {
    var deferred = Q.defer()

    Cache.getObject(key)
      .then(function (reply) {
        var regions = flatHelper.unflattenObject(reply)
        deferred.resolve(regions)
      })
      .fail(function () {
        YoutubeAPI.getRegions()
          .then(function (data) {
            deferred.resolve(data)
            saveRegionsToCache(data, key)
          })
          .fail(function (err) { deferred.reject(err) })
      })
    return deferred.promise
  }

  var saveRegionsToCache = function (data, key) {
    var object = prepareObject(data)
    Cache.saveObject(key, object)
  }

  var prepareObject = function (data) {
    var regionsData = {}
    regionsData.items = data.items

    regionsData.items = formatFields(regionsData.items)
    regionsData = flatHelper.flattenObject(regionsData)
    return regionsData
  }

  var formatFields = function (regionsArr) {
    var formattedArr =
    regionsArr.map(function (regionObj) {
      var region = {}
      region.id = regionObj.id
      region.snippet = {name: regionObj.snippet.name}

      return region
    })
    return formattedArr
  }
}

module.exports = new Regions()
