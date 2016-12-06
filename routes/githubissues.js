"use strict"

const config = require('../config')

const express = require('express')
const router = express.Router()

const request = require('request')

const dtoMapper = require('../model/DTOMapper')

/* GET issues of a github repo page. */
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
/**
 *
 * @param repo
 * @param token
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