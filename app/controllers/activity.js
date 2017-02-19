var UserInterest = require('../models/UserInterest')
UserInterest.init()

exports.trackActivityHandler = function (req, res) {
  var videoId = req.params.video
  UserInterest.insert(videoId)
  res.sendStatus(200)
}
