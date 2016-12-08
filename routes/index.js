"use strict"

const express = require('express')
const router = express.Router()

const accessTokenDB = require('../model/AccessTokenDB')

/**
 * GET index page.
 */
router.get('/', function(req, res, next) {
  if(req.cookies.google_id){
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

/**
 * GET home page.
 */
router.get('/home', function(req, res, next) {
    const id = accessTokenDB.getAccessToken(req.cookies.google_id)
    if(!id){
        res.redirect('/login')
    }
    res.render('home')
});

module.exports = router
