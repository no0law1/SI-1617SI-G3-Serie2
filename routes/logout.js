"use strict"

const express = require('express')
const router = express.Router()

const pep = require('./validation/PolicyEnforcementPoint')

const accessTokenDB = require('../model/AccessTokenDB')
const UserSessionDB = require('../model/UserSessionDB')

/**
 * POST logout user.
 */
router.post('/',
    pep.hasPermission('/logout'),
    function (req, res, next) {
        if (req.cookies.google_id) {
            accessTokenDB.removeAccessToken(req.cookies.google_id)
            res.clearCookie('google_id')
        }
        if (req.cookies.github_id) {
            accessTokenDB.removeAccessToken(req.cookies.github_id)
            res.clearCookie('github_id')
        }
        if (req.cookies.session_id) {
            UserSessionDB.removeUser(req.cookies.session_id)
            res.clearCookie('session_id')
        }
        res.redirect('/')
    }
)

module.exports = router