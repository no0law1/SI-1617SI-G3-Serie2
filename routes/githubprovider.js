"use strict";

const config = require('../config')

const express = require('express')
const router = express.Router()

function queryString() {
    return config.GITHUB_CLIENT_ID + '&' +
        config.GITHUB_REDIRECT_URI + '&' +
        config.GITHUB_SCOPE
}

/* GET github login page. */
router.get('/', function(req, res, next) {
    res.status(302)

    res.set({
        "Location": config.GITHUB_OAUTH2_URL+'?'+queryString()
    })
    res.end()
})

module.exports = router
