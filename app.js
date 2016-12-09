"use strict"

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const index = require('./routes/index')
const github = require('./routes/github')
const auth = require('./routes/auth')

const server = express()

// view engine setup
server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'hbs')

// uncomment after placing your favicon in /public
server.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
server.use(logger('dev'))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(cookieParser('secret'))  //TODO: secret
server.use(express.static(path.join(__dirname, 'public')))

server.use('/', index)
server.use('/github', github)
server.use('/login', auth)

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
