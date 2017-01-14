"use strict"

const config = require('../config')
const UserSessionDB = require('../model/UserSessionDB')
const accessTokenDB = require('../model/AccessTokenDB')
const OAuthHelper = require('../data/OAuthHelper')
const GoogleAPIService = require('../data/GoogleAPIService')
const csrf = require('csurf')

const pep = require('./validation/PolicyEnforcementPoint')

const express = require('express')
const router = express.Router()

const queryString = require('query-string')

/**
 * GET login page
 */
router.get('/',
    function (req, res, next) {
        if (!accessTokenDB.getAccessToken(req.cookies.google_id)) {
            res.render('login')
        } else {
            res.redirect('/home')
        }
    }
)

/**
 * GET google login page.
 */
router.get('/google',
    function (req, res, next) {
        res.status(302)

        // Query String module Encodes scope and others
        const query = queryString.stringify({
            redirect_uri: config.GOOGLE_REDIRECT_URI,
            client_id: config.GOOGLE_CLIENT_ID,
            scope: "profile email https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.profile",
            response_type: "code",
            state: req.csrfToken()
        });

        res.set({
            "Location": config.GOOGLE_OAUTH2_URL + '?' + query
        })
        res.end()
    }
)

/**
 * GET google callback authentication page.
 */
router.get('/google/callback',
    function (req, res, next) {
        if (req.query.error) {
            return next(new Error(req.query.error))
        }

        if (!req.query.code) {
            return next(new Error('Access Denied'))
        }

        OAuthHelper.getGoogleAccessToken(req.query.code, (error, resp, token) => {
            if (error) {
                return next(error)
            }
            res.cookie('google_id',
                accessTokenDB.putAccessToken(token),
                {
                    httpOnly: true,
                    maxAge: token.expires_in * 1000,   // expires_in (seconds) ... maxAge (miliseconds)
                })

            GoogleAPIService.retrieveProfile(token.access_token, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    res.cookie('session_id',
                        UserSessionDB.insertUser(JSON.parse(data)),
                        {httpOnly: true}
                    )
                }
                res.redirect('/home')
            })
        })
    }
)

/**
 * GET github login page.
 */
router.get('/github',
    pep.hasPermission('/login/github'),
    function (req, res, next) {
        res.status(302)

        const params = queryString.stringify({
            client_id: config.GITHUB_CLIENT_ID,
            redirect_uri: config.GITHUB_REDIRECT_URI,
            scope: 'user repo',
            state: req.csrfToken()
        })

        res.set({
            "Location": config.GITHUB_OAUTH2_URL + '?' + params
        })
        res.end()
    }
)

/**
 * GET github callback authentication page.
 */
router.get('/github/callback',
    pep.hasPermission('/login/github/callback'),
    function (req, res, next) {
        if (req.query.error) {
            return next(new Error(req.query.error))
        }

        OAuthHelper.getGithubAccessToken(req.query.code, (error, response, token) => {
            if (error) {
                return next(error)
            }
            const id = accessTokenDB.putAccessToken(token)
            //Github is a session cookie
            res.cookie('github_id', id, {
                httpOnly: true,
            })
            res.redirect(config.API_URL + 'github/repos')
        })
    }
)

module.exports = router