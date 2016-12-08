"use strict"

const config = require('../config')
const request = require('request')

/**
 * Gets access token from google by sending the code to it
 *
 * @param code uri decoded google auth code
 * @param cb {function(err, response, token)}
 */
function getGoogleAccessToken(code, cb){
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
 * Gets access token from github by sending the code to it
 *
 * @param code code to be sent
 * @param cb function(error, response, body) used for request
 */
function getGithubAccessToken(code, cb){
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

module.exports = {
    getGoogleAccessToken: getGoogleAccessToken,
    getGithubAccessToken: getGithubAccessToken,
}
