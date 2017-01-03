"use strict"

const express = require('express')
const router = express.Router()
const UserSessionDB = require('../model/UserSessionDB')

const pep = require('./validation/PolicyEnforcementPoint')

const validate = require('./validation/userValidationMiddleware')

/**
 * GET panel page.
 */
router.get('/',
    validate.googleAuthentication,
    pep.hasPermission('/panel'),
    function (req, res, next) {
        const user = UserSessionDB.getUser(req.cookies.session_id)

        res.render('panel', {permission: '/panel', user: user})
    }
)

/**
 * GET panel reboot page.
 */
router.get('/reboot',
    validate.googleAuthentication,
    pep.hasPermission('/panel/reboot'),
    function (req, res, next) {
        const user = UserSessionDB.getUser(req.cookies.session_id)

        res.render('panel', {permission: '/panel/reboot', user: user})
    }
)

/**
 * GET panel actions page.
 */
router.get('/actions',
    validate.googleAuthentication,
    pep.hasPermission('/panel/actions'),
    function (req, res, next) {
        const user = UserSessionDB.getUser(req.cookies.session_id)

        res.render('panel', {permission: '/panel/actions', user: user})
    }
)

/**
 * Delete user.
 */
router.delete('/:user/delete',
    validate.googleAuthentication,
    pep.hasPermission('/panel/:user/delete'),
    function (req, res, next) {
        console.log('deleted')
        res.redirect('back')
    }
)

module.exports = router