var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Create a schema for our data
// TODO : in separate file
var InterestSchema = new Schema({
  user_id: String,
  topic_id: String
},
{ timestamps: { createdAt: 'created_at' } })

// Use the schema to register a model with MongoDb
mongoose.model('Interest', InterestSchema)
var Interest = mongoose.model('Interest')

function UserInterest () {
  var mongoURI = process.env.MONGO_DB_URL || ''

  this.init = function () {
    mongoose.connect(mongoURI)
    var db = mongoose.connection

    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', function (callback) {
      console.log('MongoLab Connection Succeeded.')
    })
  }

  this.insert = function (topicId) {
    var topic = {user_id: 'test', topic_id: topicId}

    Interest.findOneAndUpdate(topic, topic, {upsert: true}, function (err) {
      if (err) console.log(err)
    })
  }

  this.getAll = function (userId) {
    Interest.find({ user_id: userId }, function (err, interests) {
      if (err) return console.error(err)
    })
  }
}

module.exports = new UserInterest()
