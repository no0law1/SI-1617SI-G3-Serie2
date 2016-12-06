"use strict"

const config = require('../config')
const dtoMapper = require('../model/DTOMapper')

const express = require('express')
const router = express.Router()

const request = require('request')

/**
 * GET github repos page.
 */
router.get('/', function(req, res, next) {
    if(!req.cookies.google_token){
        const error = new Error('Unauthorized')
        error.status = 401
        return next(error)
    }

    if(!req.cookies.github_token){
        res.redirect('/login/github')
    } else {
        const options = {
            url: 'https://api.github.com/user/repos',
            headers: {
                'User-Agent': 'node.js',
                'Authorization': 'token ' + req.cookies.github_token,
            }
        }
        request.get(options, function (error, response, body){
            if(error){
                return next(error)
            }

            const items = dtoMapper.repos(JSON.parse(body))
            res.render('githubrepos', {items: items})
        })
    }
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