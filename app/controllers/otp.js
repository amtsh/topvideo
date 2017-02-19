var notp = require('notp')
var request = require('request')

exports.replyWithChallenge = function (req, res) {
  if (req.query['hub.verify_token'] === 'this_is_topvideo_verify_token') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
}

exports.replyWithOTP = function (req, res) {
  var messageEvents = req.body.entry[0].messaging
  for (var i = 0; i < messageEvents.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id

    if (event.message && event.message.text) {
      var text = event.message.text
      // Handle a text message from this sender
      var reply = ''
      if (['login', 'hi', 'Hi', 'GEN'].indexOf(text) >= 0) {
        var key = sender
        reply = notp.totp.gen(key)
      } else {
        reply = "Currently I only support keyword 'hi' or 'GEN' to generate one time password."
      }
      sendTextMessage(sender, reply.substring(0, 200))
    }
  }
  res.sendStatus(200)
}

var accessToken = process.env.FB_ACCESS_TOKEN || ''

function sendTextMessage (sender, text) {
  var messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {accessToken: accessToken},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}
