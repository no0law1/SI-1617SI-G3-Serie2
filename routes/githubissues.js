"use strict"

const config = require('../config')

const express = require('express')
const router = express.Router()

const request = require('request')

const queryString = require('query-string')

/* GET github issues page. */
router.get('/', function(req, res, next) {
    if(!req.cookies.google_token){
        const error = new Error('Unauthorized')
        error.status = 401
        return next(error)
    }

    if(!req.cookies.github_token){
    //if(!config.github_token){
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
            //TODO: Parse body to an array of items, in which an item is a Repository
            const items = []
            res.render('githubissues', items)
        })
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