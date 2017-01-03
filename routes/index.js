"use strict"

const express = require('express')
const router = express.Router()
const UserSessionDB = require('../model/UserSessionDB')

const pep = require('./validation/PolicyEnforcementPoint')

const validate = require('./validation/userValidationMiddleware')

/**
 * GET index page.
 */
router.get('/',
    validate.googleAuthentication,
    function (req, res, next) {
        res.redirect('/home')
    }
)

/**
 * GET home page.
 */
router.get('/home',
    validate.googleAuthentication,
    pep.hasPermission('/home'),
    function (req, res, next) {
        const user = UserSessionDB.getUser(req.cookies.session_id)

        const roles = pep.getRoles(user.displayName).map(role => {
            return {checked: false, name: role}
        })

        if (user.roles) {
            roles.forEach(role => {
                user.roles.forEach(userRole => {
                    if (role.name == userRole.name) {
                        role.checked = userRole.checked
                    }
                })
            })
        }

        res.render('home', {
            user: user,
            roles: roles
        })
    }
)

/**
 * GET home page.
 */
router.post('/user/roles',
    validate.googleAuthentication,
    pep.hasPermission('/user/roles'),
    function (req, res, next) {
        if (!req.body.roles) {
            return next(new Error('user cannot be without roles'))
        }
        if(!Array.isArray(req.body.roles)){   // Shitty Hack, change it to client side?
            req.body.roles = [req.body.roles]
        }

        const user = UserSessionDB.getUser(req.cookies.session_id)

        let revokeRoles = []
        pep.getRoles(user.displayName).forEach(role => {
            if (!req.body.roles.includes(role)) {
                revokeRoles.push(role)
            }
        })

        pep.setRoles(user.displayName, req.body.roles, revokeRoles)

        user.roles = req.body.roles.map(role => {
            return {checked: true, name: role}
        })

        res.redirect('back')
    }
)

module.exports = router
