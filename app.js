"use strict"

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const csrf = require('csurf')
const csrfMiddleware = require('./routes/middleware/csrf')

const index = require('./routes/index')
const github = require('./routes/github')
const auth = require('./routes/auth')
const logout = require('./routes/logout')
const panel = require('./routes/panel')

const server = express()

// view engine setup
const hbs = require('hbs')
hbs.registerPartials(__dirname + '/views/partials')
server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'hbs')

server.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
server.use(logger('dev'))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(cookieParser())
server.use(csrf({cookie: true}))
server.use(express.static(path.join(__dirname, 'public')))

server.use(csrfMiddleware)
server.use('/', index)
server.use('/github', github)
server.use('/login', auth)
server.use('/logout', logout)
server.use('/panel', panel)

// catch 404 and forward to error handler
server.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
server.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
    res.render('error')
})

module.exports = server
