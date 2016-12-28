"use strict"

const pdpFactory = require('policy-decision-point')
const pdp = pdpFactory.initSync('./pdp.json')
const UserAccessDB = require('../../model/UserSessionDB')

module.exports = function (req, res, next) {
    let pdpUser
    let roles
    const user = UserAccessDB.getUser(req.cookies.session_id)
    if(!user){
        pdpUser = "Guest"
        roles = ["guest"]
    } else {
        pdpUser = user.displayName;
        if(!user.roles){
            roles = ["userWithNoRoles"]
        } else {
            roles = user.roles
        }
    }

    if(pdp.login(pdpUser, roles)){
        if(pdp.isPermitted(pdpUser, req.path)){
            return next()
        }
    }

    res.redirect('/')
    // const error = new Error("Access Denied")
    // error.status = 403
    // next(error)
}