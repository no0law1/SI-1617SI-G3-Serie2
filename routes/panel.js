"use strict"

const express = require('express')
const router = express.Router()
const UserSessionDB = require('../model/UserSessionDB')

const pep = require('./validation/PolicyEnforcementPoint')

const validate = require('./validation/Validations')

/**
 * GET panel page.
 */
router.get('/',
    validate.googleAuthentication,
    pep.hasPermission('/panel'),
    function (req, res, next) {
        res.render('panel', {permission: '/panel', _csrf: req.csrfToken()})
    }
)

/**
 * GET panel reboot page.
 */
router.get('/reboot',
    validate.googleAuthentication,
    pep.hasPermission('/panel/reboot'),
    function (req, res, next) {
        res.render('panel', {permission: '/panel/reboot', _csrf: req.csrfToken()})
    }
)

/**
 * GET panel actions page.
 */
router.get('/actions',
    validate.googleAuthentication,
    pep.hasPermission('/panel/actions'),
    function (req, res, next) {
        res.render('panel', {permission: '/panel/actions', _csrf: req.csrfToken()})
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