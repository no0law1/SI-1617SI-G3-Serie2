"use strict"

const express = require('express')
const router = express.Router()

const accessTokenDB = require('../model/AccessTokenDB')

/**
 * GET index page.
 */
router.get('/', function(req, res, next) {
    if(req.cookies.google_id){
        accessTokenDB.removeAccessToken(req.cookies.google_id)
        res.clearCookie('google_id')
    }
    if(req.cookies.github_id){
        accessTokenDB.removeAccessToken(req.cookies.github_id)
        res.clearCookie('github_id')
    }
    res.redirect('back')
})

module.exports = router