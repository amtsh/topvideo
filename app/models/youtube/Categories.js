var YoutubeAPI = require('../../api/YoutubeAPI')
var Cache = require('../../lib/RedisCache')
var flatHelper = require('../../helpers/flatHelper')
var Q = require('q')

function Categories () {
  var keyPrefix = 'videoCategories'

  this.get = function (regionCode) {
    var deferred = Q.defer()
    var key = keyPrefix + ':' + regionCode

    Cache.getObject(key)
      .then(function (reply) {
        var categories = flatHelper.unflattenObject(reply)
        deferred.resolve(categories)
      })
      .fail(function () {
        YoutubeAPI.getCategoriesPerRegion(regionCode)
          .then(function (data) {
            deferred.resolve(data)
            saveCategoriesToCache(data, key)
          })
          .fail(function (err) { deferred.reject(err) })
      })
    return deferred.promise
  }

  var saveCategoriesToCache = function (data, key) {
    var object = prepareObject(data)
    Cache.saveObject(key, object)
  }

  var prepareObject = function (data) {
    var categoryData = {}
    categoryData.items = data.items

    categoryData.items = formatFields(categoryData.items)
    categoryData = flatHelper.flattenObject(categoryData)
    return categoryData
  }

  var formatFields = function (categoryArr) {
    var formattedArr =
    categoryArr.map(function (categoryObj) {
      var category = {}
      category.id = categoryObj.id
      category.snippet = {title: categoryObj.snippet.title}
      return category
    })
    return formattedArr
  }
}

module.exports = new Categories()
