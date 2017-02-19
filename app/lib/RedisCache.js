var redis = require('redis')
var Q = require('q')

function RedisCache () {
  var redisClient

  this.initialize = function () {
    var redisUrl = process.env.REDIS_URL || ''

    redisClient = redis.createClient(redisUrl)

    redisClient.on('error', function (err) {
      console.log('Error ' + err)
    })
    redisClient.on('connect', function () {
      console.log('Connected to Redis' + redisUrl)
    })
  }

  this.save = function (key, textBlob, expireTime) {
    redisClient.set(key, textBlob, redis.print)

    if (expireTime) {
      // expire for 10min
      this.expire(key, expireTime)
    }
  }

  this.get = function (key) {
    var deferred = Q.defer()

    redisClient.get(key, function (err, reply) {
      if (reply !== null) {
        console.log('CacheHit: ' + key)
        deferred.resolve(reply)
      } else {
        console.log('CacheMiss: ' + key)
        deferred.reject(err)
      }
    })
    return deferred.promise
  }

  this.expire = function (key, time) {
    redisClient.expire(key, time)
  }

  this.saveObject = function (key, obj) {
    redisClient.hmset(key, obj)
  }

  this.getObject = function (key) {
    var deferred = Q.defer()

    redisClient.hgetall(key, function (err, obj) {
      if (obj !== null) {
        console.log('CacheHit: ' + key)
        deferred.resolve(obj)
      } else {
        console.log('CacheMiss: ' + key)
        deferred.reject(err)
      }
    })

    return deferred.promise
  }
}
module.exports = new RedisCache()
