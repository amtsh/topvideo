var YoutubeModel = require('../models/Youtube')
var RegionsModel = require('../models/youtube/Regions')
var CategoriesModel = require('../models/youtube/Categories')
var Cache = require('../lib/RedisCache')
var formatHelper = require('../helpers/formatHelper')

var Youtube = new YoutubeModel()
Cache.initialize()

exports.regionHandler = function (req, res) {
  RegionsModel.get()
    .then(function (data) {
      res.json(data)
    })
    .fail(function (err) {
      res.json(err)
    })
}

exports.categoryHandler = function (req, res) {
  var regionCode = req.params.region

  CategoriesModel.get(regionCode)
    .then(function (data) {
      res.json(data)
    })
    .fail(function (err) {
      res.json(err)
    })
}

exports.trendingHandler = function (req, res) {
  var args = {}

  args['regionCode'] = req.params.region
  args['categoryCode'] = req.params.category
  args['nextPageToken'] = req.params.nexttoken || null
  var nextPageParam = args.nextPageToken ? ':' + req.params.nexttoken : ''
  args['key'] = 'trending:' + args.regionCode + ':' + args.categoryCode + nextPageParam

  Cache.get(args.key)
    .then(function (reply) {
      cacheHitHandler(res, 'trending', reply)
    })
    .fail(function () {
      getPopularVideos(res, args)
    })
}

function getPopularVideos (res, args) {
  Youtube.getMostPopular(args.regionCode, args.categoryCode, args.nextPageToken)
    .then(function (data) {
      res.json(data)
      saveToCache(data, args.key, 600)
    })
    .fail(function (err) {
      res.json(err.response.body)
    })
}

exports.searchHandler = function (req, res) {
  var query = req.params.query

  if (isEmpty(query)) {
    res.json({error: 'query is required.'})
  }

  Youtube.search(query)
    .then(function (data) {
      res.json(data)
    })
    .fail(function (err) {
      res.json(err.response.body)
    })
}

exports.suggestHandler = function (req, res) {
  var query = req.params.query

  var key = query
  Cache.get(key)
    .then(function (reply) {
      var response = {}
      response.success = true
      response.results = reply.split(':').map(function (field) {
        return {name: field, value: field}
      })
      res.json(response)
    })
    .fail(function () {
      getSuggestions(res, query)
    })
}

function getSuggestions (res, query) {
  Youtube.suggestQueries(query)
    .then(function (data) {
      var response = {}
      response.success = true
      response.results = data[1].map(function (field) {
        return {name: field, value: field}
      })
      res.json(response)

      Cache.save(data[0], data[1].join(':'), 600)
    })
    .fail(function (err) {
      console.log(err)
    })
}

function cacheHitHandler (res, key, reply) {
  res.json(formatHelper.formatForResponse(key, reply))
}

function saveToCache (data, key, expireTime) {
  if (data.items) {
    var pagetoken = data.nextPageToken || null
    Cache.save(key, formatHelper.formatToSave(data.items, key.split(':')[0], pagetoken), expireTime)
  }
}

function isEmpty (str) {
  return (!str || !str.length)
}
