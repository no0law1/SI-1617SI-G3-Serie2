"use strict"

const config = require('../config')
const dtoMapper = require('../model/DTOMapper')
const accessTokenDB = require('../model/AccessTokenDB')

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
    //console.log('https://api.github.com/repos/' + owner + '/' + name + '/issues')
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
 * GET github repos page.
 */
router.get('/repos', function(req, res, next) {
    const goog_token = accessTokenDB.getAccessToken(req.signedCookies.google_id)
    if(!goog_token){
        return res.redirect('/login')
    }
    const git_token = accessTokenDB.getAccessToken(req.signedCookies.github_id)
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
})

/**
 * GET issues of a github repo page.
 * :repo is repo name
 */
router.get('/:repo/issues', function(req, res, next) {
    const goog_token = accessTokenDB.getAccessToken(req.signedCookies.google_id)
    if(!goog_token){
        return res.redirect('/login')
    }
    const git_token = accessTokenDB.getAccessToken(req.signedCookies.github_id)
    if(!git_token){
        return res.redirect('/login/github')
    }

    const name = req.params.repo
    const owner = req.query.owner
    getIssues(name, owner, git_token.access_token, (error, response, body) => {
        if(error){
            return next(error)
        }
        const items = dtoMapper.issues(JSON.parse(body))
        res.render('githubissues', {name: name, owner: owner, issues: items})
    })
})

/**
 * POST issues to google tasks.
 */
router.post('/tasks', function(req, res, next) {
    const google_token = accessTokenDB.getAccessToken(req.signedCookies.google_id)
    if(!google_token){
        return res.redirect('/login')
    }
    const git_token = accessTokenDB.getAccessToken(req.signedCookies.github_id)
    if(!git_token){
        return res.redirect('/login/github')
    }
    const body = JSON.stringify({title: req.body.title})
    const options = {
        url: 'https://www.googleapis.com/tasks/v1/users/@me/lists',
        body: body,
        headers: {
            'User-Agent': 'node.js',
            'Authorization': 'Bearer ' + google_token.access_token,
            'Content-Type': 'application/json',
            'Content-Length': body.length,
        },
    }

    request.post(options, (error, response, body) => {
        if(error){
            return console.log(error.message)
        }
        const id = JSON.parse(body).id

        getIssues(req.body.title, req.body.owner, git_token.access_token, (error, response, body) => {
            if(error){
                return next(error)
            }

            const items = dtoMapper.issues(JSON.parse(body))
            if(items.length <= 0){
                return res.end('Success')
            }

            items.forEach((item) => {
                let myBody = JSON.stringify({title: item.name})

                const options = {
                    url: 'https://www.googleapis.com/tasks/v1/lists/'+id+'/tasks',
                    body: myBody,
                    headers: {
                        'User-Agent': 'node.js',
                        'Authorization': 'Bearer ' + google_token.access_token,
                        'Content-Type': 'application/json',
                        'Content-Length': myBody.length,
                    },
                }

                request.post(options, (error, response, body) => {
                    if(error){
                        return next(error)
                    }
                    //TODO: success on view
                    res.end('Success')
                })
            })
        })
    })
})

module.exports = router