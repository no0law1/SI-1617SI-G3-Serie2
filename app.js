"use strict"

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const index = require('./routes/index')
const home = require('./routes/home')
const githubIssues = require('./routes/githubissues')
const login = require('./routes/login')
const googleProvider = require('./routes/googleprovider')
const googleCallback = require('./routes/googlecallback')
const githubProvider = require('./routes/githubprovider')
const githubCallback = require('./routes/githubcallback')

const server = express()

// view engine setup
server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'hbs')

// uncomment after placing your favicon in /public
server.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
server.use(logger('dev'))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(cookieParser())
server.use(express.static(path.join(__dirname, 'public')))

server.use('/', index)
server.use('/home', home)
server.use('/githubissues', githubIssues)

/**
 * Basic Initial Authentication
 */
server.use('/login', login)

/**
 * Github Authentication
 */
server.use('/login/github/callback', githubCallback)
server.use('/login/github', githubProvider)

/**
 * Google Authentication
 */
server.use('/login/google/callback', googleCallback)
server.use('/login/google', googleProvider)

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
