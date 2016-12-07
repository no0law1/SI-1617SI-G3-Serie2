"use strict"

const config = require('../config')
const dtoMapper = require('../model/DTOMapper')
const accessTokenDB = require('../model/AccessTokenDB')

const express = require('express')
const router = express.Router()

const request = require('request')

/**
 * GET github repos page.
 */
router.get('/', function(req, res, next) {
    const goog_token = accessTokenDB.getAccessToken(req.cookies.google_id)
    if(!goog_token){
        return res.redirect('/login')
    }
    const git_token = accessTokenDB.getAccessToken(req.cookies.github_id)
    if(!git_token){
        return res.redirect('/login/github')
    }
    const options = {
        url: 'https://api.github.com/user/repos',
        headers: {
            'User-Agent': 'node.js',
            'Authorization': 'token ' + git_token.access_token,
        }
    }
    request.get(options, function (error, response, body){
        if(error){
            return next(error)
        }

        const items = dtoMapper.repos(JSON.parse(body))
        res.render('githubrepos', {items: items})
    })
});


//const queryString = require('query-string')

// /**
//  * Handles search of a repository. Not Implemented in view
//  */
// router.post('/', function (req, res, next) {
//     const url = 'https://api.github.com/search/repositories'
//     const params = queryString.stringify({
//         q:req.body.repo_search,
//     })
//
//     console.log(url + '?' + params)
//
// })

module.exports = router;