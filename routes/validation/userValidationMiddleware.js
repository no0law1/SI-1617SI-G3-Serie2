"use strict"

const accessTokenDB = require('../../model/AccessTokenDB')

module.exports = {
    googleAuthentication: function (req, res, next) {
        const google_token = accessTokenDB.getAccessToken(req.cookies.google_id)
        if (!google_token) {
            return res.redirect('/login')
        }

        req.google_token = google_token
        next()
    },
    githubAuthentication: function (req, res, next) {
        const github_token = accessTokenDB.getAccessToken(req.cookies.github_id)
        if(!github_token){
            return res.redirect('/login/github')
        }

        req.github_token = github_token
        next()
    }
}
