"use strict"

const express = require('express')
const router = express.Router()
const UserSessionDB = require('../model/UserSessionDB')

const accessTokenDB = require('../model/AccessTokenDB')

/**
 * GET index page.
 */
router.get('/', function (req, res, next) {
    const id = accessTokenDB.getAccessToken(req.cookies.google_id)
    if (!id) {
        res.redirect('/login')
    } else {
        res.redirect('/home')
    }
})

/**
 * GET home page.
 */
router.get('/home', function (req, res, next) {
    const id = accessTokenDB.getAccessToken(req.cookies.google_id)
    if (!id) {
        res.redirect('/login')
    } else {
        res.render('home', {
            user: UserSessionDB.getUser(req.cookies.session_id)
        })
    }
});

module.exports = router
