"use strict"

const config = require('../config')
const accessTokenDB = require('../model/AccessTokenDB')
const UserSessionDB = require('../model/UserSessionDB')
const GithubAPIService = require('../data/GithubAPIService')
const GoogleAPIService = require('../data/GoogleAPIService')

const express = require('express')
const router = express.Router()

const request = require('request')

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

    GithubAPIService.retrieveRepos(git_token.access_token, (err, repos) => {
        if(err){
            return next(err)
        }
        res.render('githubrepos', {
            user: UserSessionDB.getUser(req.cookies.session_id),
            items: repos
        })
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
    GithubAPIService.retrieveIssues(git_token.access_token, name, owner, (err, issues) => {
        if(err){
            return next(err)
        }

        res.render('githubissues', {
            user: UserSessionDB.getUser(req.cookies.session_id),
            name: name,
            owner: owner,
            issues: issues
        })
    })
})

/**
 * POST issues to google tasks.
 */
router.post('/tasks', function(req, res, next) {
    const google_token = accessTokenDB.getAccessToken(req.cookies.google_id)
    if(!google_token){
        return res.redirect('/login')
    }
    const git_token = accessTokenDB.getAccessToken(req.cookies.github_id)
    if(!git_token){
        return res.redirect('/login/github')
    }

    GoogleAPIService.postTaskList(google_token.access_token,
        JSON.stringify({title: req.body.title}),
        (err, id) => {
            if (err) {
                return next(err)
            }

            const name = req.body.title
            const owner = req.body.owner
            GithubAPIService.retrieveIssues(git_token.access_token, name, owner, (err, issues) => {
                if (err) {
                    return next(err)
                }

                issues.forEach((issue) => {
                    GoogleAPIService.postTask(google_token.access_token,
                        id,
                        JSON.stringify({title: issue.name}),
                        (err, data) => {
                            if (err) {
                                return next(err)
                            }
                            console.log(data)
                            res.end('success')
                        })
                })
            })
        })
})

module.exports = router