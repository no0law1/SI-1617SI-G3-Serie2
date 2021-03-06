"use strict"

const accessTokenDB = require('../../model/AccessTokenDB')
const UserSessionDB = require('../../model/UserSessionDB')

module.exports = {
    googleAuthentication: function (req, res, next) {
        const google_token = accessTokenDB.getAccessToken(req.cookies.google_id)
        if (!google_token) {
            return res.redirect('/login')
        }

        const user = UserSessionDB.getUser(req.cookies.session_id)
        if(!user){
            const error = new Error('No user')
            error.status = 500
            next(error)
        }

        if(user.message){
            res.locals.message = user.message
            delete user.message
        }

        res.locals.user = user
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
