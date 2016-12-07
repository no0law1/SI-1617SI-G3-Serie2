"use strict";

const config = require('../config')
const accessTokenDB = require('../model/AccessTokenDB')

const express = require('express')
const router = express.Router()

const request = require('request')

/**
 * Gets access token from github by sending the code to it
 *
 * @param code code to be sent
 * @param cb function(error, response, body) used for request
 */
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

/**
 * GET github callback authentication page.
 */
router.get('/', function(req, res, next) {
    if(req.query.error){
        return next(new Error(req.query.error))
    }
    if(!req.query.state || req.query.state != 'ola_sou_github'){    //TODO: change this
        return next(new Error())
    }

    getAccessToken(req.query.code, (error, response, token) => {
        if(error){
            return next(error)
        }
        const id = accessTokenDB.putAccessToken(token)
        res.cookie('github_id', id, {
            httpOnly:true,
            maxAge:token.expires_in*1000,   // expires_in (seconds) ... maxAge (miliseconds)
        })
        res.redirect(config.API_URL+'github/repos')
    })
})

module.exports = router
