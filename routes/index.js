"use strict"

const express = require('express')
const router = express.Router()
const UserSessionDB = require('../model/UserSessionDB')

const validate = require('./validation/userValidationMiddleware')

/**
 * GET index page.
 */
router.get('/', validate.googleAuthentication, function (req, res, next) {
    res.redirect('/home')
})

/**
 * GET home page.
 */
router.get('/home', validate.googleAuthentication, function (req, res, next) {
    res.render('home', {
        user: UserSessionDB.getUser(req.cookies.session_id)
    })
})

module.exports = router
