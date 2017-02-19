var Q = require('q')
var request = require('request-promise')

function YoutubeAPI () {
  var youtubeHost = 'https://www.googleapis.com/youtube/v3'
  var API_KEY = process.env.YT_API_KEY || ''
  var keyParam = '?key=' + API_KEY
  var partParam = '&part=' + 'snippet'
  var defaultParam = keyParam + partParam

  this.getRegions = function () {
    var deferred = Q.defer()
    var params = defaultParam

    var options = prepareRequest(youtubeHost + '/i18nRegions' + params)

    request(options)
      .then(function (data) {
        deferred.resolve(data)
      })
      .catch(function (err) {
        deferred.reject(err)
      })
    return deferred.promise
  }

  this.getCategoriesPerRegion = function (region) {
    var deferred = Q.defer()
    var regionParam = '&regionCode=' + region
    var params = defaultParam + regionParam

    var options = prepareRequest(youtubeHost + '/videoCategories' + params)
    request(options)
      .then(function (data) {
        deferred.resolve(data)
      })
      .catch(function (err) {
        deferred.reject(err)
      })
    return deferred.promise
  }

  var prepareRequest = function (url) {
    return {
      url: url,
      method: 'GET',
      json: true
    }
  }
}

module.exports = new YoutubeAPI()
