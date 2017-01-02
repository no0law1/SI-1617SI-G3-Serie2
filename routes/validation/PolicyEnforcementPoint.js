"use strict"

const pdpFactory = require('policy-decision-point')
const pdp = pdpFactory.initSync('./pdp.json')
const UserAccessDB = require('../../model/UserSessionDB')

module.exports = {

    grantRoles: function (user, roles) {
        pdp.grantRoles(user, roles)
    },

    revokeRoles: function (user, roles) {
        pdp.revokeRoles(user, roles)
    },

    getRoles: function (user) {
        const arr = pdp.userRoles(user)
        arr.splice(0, 1)    //Hack to remove guest from roles (may be removed)
        return arr
    },

    middleware: function (req, res, next) {
        let pdpUser
        let roles
        const user = UserAccessDB.getUser(req.cookies.session_id)
        if (!user) {
            pdpUser = "Guest"
            roles = [{checked:true, name:"guest"}]
        } else {
            pdpUser = user.displayName;
            if (!user.roles) {
                user.roles = [{checked: true, name:"userWithNoRoles"}]
            }
            roles = user.roles
        }

        if(pdp.login(pdpUser, roles.map(role => { return role.name }))){
            if (pdp.isPermitted(pdpUser, req.path)) {
                return next()
            }
        }

        res.redirect('/')
        // const error = new Error("Access Denied")
        // error.status = 403
        // next(error)
    }
}