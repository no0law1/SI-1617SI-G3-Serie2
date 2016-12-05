"use strict";

const config = require('../config')

const express = require('express')
const router = express.Router()

const queryString = require('query-string')

/**
 * To mitigate against cross-site request forgery
 */
const state = ''    //TODO

/* GET github login page. */
router.get('/', function (req, res, next) {
    res.status(302)

    const params = queryString.stringify({
        client_id: config.GITHUB_CLIENT_ID,
        redirect_uri: config.GITHUB_REDIRECT_URI,
        scope: 'user repo',
    })

    res.set({
        "Location": config.GITHUB_OAUTH2_URL + '?' + params
    })
    res.end()
})

module.exports = router
