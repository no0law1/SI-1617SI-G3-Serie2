"use strict"

const config = require('../config')

const express = require('express')
const router = express.Router()

const queryString = require('query-string')

/**
 * To mitigate against cross-site request forgery
 */
const state = ''    //TODO

/* GET google login page. */
router.get('/', function(req, res, next) {
    res.status(302)

    // Query String module Encodes
    var query = queryString.stringify({
        redirect_uri: config.GOOGLE_REDIRECT_URI,
        client_id: config.GOOGLE_CLIENT_ID,
        scope: "profile email",
        response_type: "code"
    })

    res.set({
        "Location": config.GOOGLE_OAUTH2_URL + '?' + query
    })
    res.end()
})

module.exports = router
