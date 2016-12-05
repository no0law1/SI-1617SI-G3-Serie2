"use strict"

const config = require('../config')

const express = require('express')
const router = express.Router()

const request = require('request')

const queryString = require('query-string')

/* GET github issues page. */
router.get('/', function(req, res, next) {
    if(!config.token){
        const error = new Error('Unauthorized')
        error.status = 401
        return next(error)
    }

    if(!config.github){
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
    const host = 'https://api.github.com'
    const path = '/search/repositories'
    const params = {
        q:req.body.repo_search,
    }

    console.log(host+path+'?'+queryString.stringify(params))

})

module.exports = router;