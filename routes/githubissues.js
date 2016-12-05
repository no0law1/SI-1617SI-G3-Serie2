"use strict"

const config = require('../config')

const express = require('express')
const router = express.Router()

const request = require('request')

const queryString = require('query-string')

/* GET github issues page. */
router.get('/', function(req, res, next) {
    if(!config.google_token){
        const error = new Error('Unauthorized')
        error.status = 401
        return next(error)
    }

    if(!config.github_token){
        res.redirect('/login/github')
    } else {
        const url = 'https://api.github.com/user/repos'
        request.get(url, function (error, response, body){
            if(error){
                return next(error)
            }
            const items = {}
            res.render('githubissues', items)
        })
        //TODO
        // Request Issues of a specified Github Project
        // Need authentication to github
    }
});

router.post('/', function (req, res, next) {
    const url = 'https://api.github.com/search/repositories'
    const params = queryString.stringify({
        q:req.body.repo_search,
    })

    console.log(url + '?' + params)

})

module.exports = router;