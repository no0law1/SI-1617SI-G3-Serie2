"use strict"

const config = require('../config')
const UserSessionDB = require('../model/UserSessionDB')
const GithubAPIService = require('../data/GithubAPIService')
const GoogleAPIService = require('../data/GoogleAPIService')

const validate = require('./validation/Validations')
const pep = require('./validation/PolicyEnforcementPoint')

const express = require('express')
const router = express.Router()

const request = require('request')

/**
 * GET github repos page.
 */
router.get('/repos',
    validate.googleAuthentication,
    validate.githubAuthentication,
    pep.hasPermission('/github/repos'),
    function (req, res, next) {
        GithubAPIService.retrieveRepos(req.github_token.access_token, (err, repos) => {
            if (err) {
                return next(err)
            }
            res.render('githubrepos', {
                items: repos
            })
        })
    }
)

/**
 * GET issues of a github repo page.
 * :repo is repo name
 */
router.get('/:repo/issues',
    validate.googleAuthentication,
    validate.githubAuthentication,
    pep.hasPermission('/github/:repo/issues'),
    function (req, res, next) {
        const name = req.params.repo
        const owner = req.query.owner
        GithubAPIService.retrieveIssues(req.github_token.access_token, name, owner, (err, issues) => {
            if (err) {
                return next(err)
            }

            res.render('githubissues', {
                name: name,
                owner: owner,
                issues: issues
            })
        })
    }
)

/**
 * POST issues to google tasks.
 */
router.post('/tasks',
    validate.googleAuthentication,
    validate.githubAuthentication,
    pep.hasPermission('/github/tasks'),
    function (req, res, next) {
        GoogleAPIService.postTaskList(req.google_token.access_token,
            JSON.stringify({title: req.body.title}),
            (err, id) => {
                if (err) {
                    return next(err)
                }

                const name = req.body.title
                const owner = req.body.owner
                GithubAPIService.retrieveIssues(req.github_token.access_token, name, owner, (err, issues) => {
                    if (err) {
                        return next(err)
                    }

                    issues.forEach((issue) => {
                        GoogleAPIService.postTask(req.google_token.access_token,
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
    }
)

module.exports = router