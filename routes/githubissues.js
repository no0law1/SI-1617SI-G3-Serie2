"use strict"

const config = require('../config')
const dtoMapper = require('../model/DTOMapper')

const express = require('express')
const router = express.Router()

const request = require('request')

/**
 * Gets the issues of a specific repository
 *
 * @param name name of the repository
 * @param owner owner of the repository
 * @param token github authentication access token
 * @param cb function(error, response, body)
 */
function getIssues(name, owner, token, cb){
    console.log('https://api.github.com/repos/' + owner + '/' + name + '/issues')
    const options = {
        url: 'https://api.github.com/repos/' + owner + '/' + name + '/issues',
        headers: {
            'User-Agent': 'node.js',
            'Authorization': 'token ' + token,
        }
    }

    request.get(options, cb)
}

/**
 * GET issues of a github repo page.
 * :repo is repo name
 */
router.get('/github/:repo/issues', function(req, res, next) {
    const name = req.params.repo
    const owner = req.query.owner
    getIssues(name, owner, req.cookies.github_token, (error, response, body) => {
        if(error){
            return next(error)
        }
        const items = dtoMapper.issues(JSON.parse(body))
        res.render('githubissues', {name: name, issues: items})
    })
})


module.exports = router