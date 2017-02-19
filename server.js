var appRouter = require('./app/routes')
var bodyParser = require('body-parser')
var express = require('express')

// heroku specific
var sslRedirect = require('heroku-ssl-redirect')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// enable ssl redirect
app.use(sslRedirect())
// server static files from public folder
app.use(express.static('public'))

app.use('/api', appRouter.ytRoutes)
app.use('/tracker', appRouter.activityRoutes)
// app.use('/fb', appRouter.fbRoutes)

var port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})
