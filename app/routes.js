var express = require('express')
var ytController = require('./controllers/youtube')
var otpController = require('./controllers/otp')
var activityController = require('./controllers/activity')

var ytRouter = express.Router()
var activityRouter = express.Router()
var fbRouter = express.Router()

ytRouter.get('/regions', ytController.regionHandler)
ytRouter.get('/categories/:region', ytController.categoryHandler)
ytRouter.get('/trending/:region/:category/:nexttoken?', ytController.trendingHandler)
ytRouter.get('/suggestions/:query', ytController.suggestHandler)
ytRouter.get('/search/:query', ytController.searchHandler)

activityRouter.get('/activity/:video', activityController.trackActivityHandler)

// messenger webhook
fbRouter.get('/webhook/', otpController.replyWithChallenge)
fbRouter.post('/webhook/', otpController.replyWithOTP)

var router = {
  ytRoutes: ytRouter,
  activityRoutes: activityRouter,
  fbRoutes: fbRouter
}
module.exports = router
