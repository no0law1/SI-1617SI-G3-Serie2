"use strict"

const config = require('../config')

const express = require('express')
const router = express.Router()

const request = require('request')

/**
 * Gets access token from google by sending the code to it
 *
 * @param code uri decoded google auth code
 * @param cb {function(err, response, token)}
 */
function getAccessToken(code, cb){
    const params = {
        code: code,
        client_id: config.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        redirect_uri: config.GOOGLE_REDIRECT_URI,
        //redirect_uri: config.API_URL + 'home',
        grant_type: 'authorization_code'
    }

    request.post(config.GOOGLE_OAUTH2_TOKEN_URL, {
        json:true,
        form:params
    }, cb)

}

/**
 * GET google callback authentication page.
 */
router.get('/', function(req, res, next) {
    if(req.query.error) {
        return next(new Error(req.query.error))
    }

    if(req.query.code){
        //Ask for access token(save access token or request always?)
        getAccessToken(req.query.code, (error, resp, token) => {
            if(error){
                return next(error)
            }
            res.cookie('google_token', token.access_token, {
                httpOnly:true,
                //Session cookie? maxAge very small
                //maxAge:token.expires_in,
            })
            res.redirect(config.API_URL+'home')
        })
    } else {
        next(new Error('Access Denied'))
    }
})

module.exports = router
