"use strict"

const express = require('express')
const router = express.Router()
const UserSessionDB = require('../model/UserSessionDB')

const pep = require('./validation/PolicyEnforcementPoint')

const validate = require('./validation/Validations')

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
        const user = res.locals.user

        const roles = pep.getRoles(user.email).map(role => {
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
            roles: roles
        })
    }
)

/**
 * POST roles a user wants/needs.
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

        const user = res.locals.user

        const grantedRoles = pep.setRoles(user.email, req.body.roles)

        user.roles = grantedRoles.map(role => {
            return {checked: true, name: role}
        })

        user.message = {type: 'info', message: 'Roles successfully granted'}
        res.redirect('back')
    }
)

module.exports = router
