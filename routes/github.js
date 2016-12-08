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
 * GET github repos page.
 */
router.get('/repos', function(req, res, next) {
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
})

/**
 * GET issues of a github repo page.
 * :repo is repo name
 */
router.get('/:repo/issues', function(req, res, next) {
    const goog_token = accessTokenDB.getAccessToken(req.cookies.google_id)
    if(!goog_token){
        return res.redirect('/login')
    }
    const git_token = accessTokenDB.getAccessToken(req.cookies.github_id)
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
        res.render('githubissues', {name: name, issues: items})
    })
})

/**
 * POST issues to google tasks.
 */
router.post('/tasks', function(req, res, next) {
    const token = accessTokenDB.getAccessToken(req.cookies.google_id)
    if(!token){
        return res.redirect('/login')
    }

    const body = {
        "title": req.body.title,
    }

    const options = {
        url: 'https://www.googleapis.com/tasks/v1/users/@me/lists',
        body: JSON.stringify(body),
        headers: {
            'User-Agent': 'node.js',
            'Authorization': 'Bearer ' + token.access_token,
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(body).length,
        },
    }

    request.post(options, (error, response, body) => {
        if(error){
            return console.log(error.message)
        }
        console.log(body)
        //TODO: post
    })
})

module.exports = router