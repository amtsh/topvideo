var Q = require('q')
var request = require('request-promise')

function Youtube () {
  var youtubeHost = 'https://www.googleapis.com/youtube/v3'
  var suggestQueriesHost = 'http://suggestqueries.google.com/complete/search'
  var API_KEY = 'AIzaSyAkOgxj31dpXHAg-tT9SI2ADsNXOHWKZAM'
  var partParam = '&part=' + 'snippet'
  var keyParam = '?key=' + API_KEY
  var defaultParam = keyParam + partParam

  this.supportedRegions = function () {
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

  this.categoriesPerRegion = function (region) {
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

  this.getMostPopular = function (region, category, pageToken) {
    var deferred = Q.defer()
    var chartParam = '&chart=' + 'mostPopular'
    var regionParam = '&regionCode=' + region
    var categoryParam = category ? '&videoCategoryId=' + category : ''
    var pageTokenParam = pageToken ? '&pageToken=' + pageToken : ''
    var maxResults = 15
    var maxResultsParam = '&maxResults=' + maxResults

    var params = defaultParam + chartParam + regionParam + categoryParam +
      pageTokenParam + maxResultsParam

    console.log(youtubeHost + '/videos' + params)
    var options = prepareRequest(youtubeHost + '/videos' + params)
    request(options)
      .then(function (data) {
        console.log(data.stringify())
        deferred.resolve(data)
      })
      .catch(function (err) {
        deferred.reject(err)
      })
    return deferred.promise
  }

  this.search = function (query) {
    var type = '&type=video'
    var params = keyParam + partParam + '&q=' + query + type
    var options = prepareRequest(youtubeHost + '/search' + params)

    var deferred = Q.defer()
    request(options)
      .then(function (data) {
        deferred.resolve(data)
      })
      .catch(function (err) {
        deferred.reject(err)
      })
    return deferred.promise
  }

  this.suggestQueries = function (query) {
    var deferred = Q.defer()

    var queryParam = '&q=' + query
    var params = '?client=youtube&ds=yt&client=firefox' + queryParam

    console.log(suggestQueriesHost + params)
    var options = prepareRequest(suggestQueriesHost + params)
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

module.exports = Youtube
