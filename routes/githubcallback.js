"use strict";

const config = require('../config')

const express = require('express')
const router = express.Router()

const request = require('request')

function getAccessToken(code, cb){
    const params = {
        code: code,
        client_id: config.GITHUB_CLIENT_ID,
        client_secret: config.GITHUB_CLIENT_SECRET,
        redirect_uri: config.GITHUB_REDIRECT_URI,
        //redirect_uri: config.API_URL + 'home',
    }

    request.post(config.GITHUB_OAUTH2_TOKEN_URL, {
        json:true,
        form:params
    }, cb)
}

/* GET github callback authentication page. */
router.get('/', function(req, res, next) {
    if(req.query.error){
        return next(new Error(req.query.error))
    }

    getAccessToken(req.query.code, (error, response, token) => {
        if(error){
            return next(error)
        }
        config.github_token = token
        res.redirect(config.API_URL+'githubissues')
    })
})

module.exports = router
