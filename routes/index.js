"use strict"

const express = require('express')
const router = express.Router()
const UserSessionDB = require('../model/UserSessionDB')

const validate = require('./validation/userValidationMiddleware')

/**
 * GET index page.
 */
router.get('/', validate.googleAuthentication, function (req, res, next) {
    res.redirect('/home')
})

/**
 * GET home page.
 */
router.get('/home', validate.googleAuthentication, function (req, res, next) {
    const user = UserSessionDB.getUser(req.cookies.session_id)
    let roles

    //TODO: see roles? pep get roles?
    // Dummy for testing
    roles = [{name: "admin", checked: false}, {name: "user", checked:false}]

    //TODO: needs to be set on post /user/roles to pdp
    if(user.roles){
        console.log(user.roles === Array)
        roles.forEach(role => {
            if(user.roles.includes(role.name)){
                role.checked = true
            } else {
                role.checked = false
            }
        })
    }

    res.render('home', {
        user: user,
        roles: roles
    })
})

/**
 * GET home page.
 */
router.post('/user/roles', validate.googleAuthentication, function (req, res, next) {
    const user = UserSessionDB.getUser(req.cookies.session_id)
    user.roles = req.body.roles
    res.redirect('back')
})

module.exports = router
