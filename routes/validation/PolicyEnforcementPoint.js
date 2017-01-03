"use strict"

const pdpFactory = require('policy-decision-point')
const pdp = pdpFactory.initSync('./pdp.json')
const UserAccessDB = require('../../model/UserSessionDB')


module.exports = {

    /**
     * Set's the user's roles
     *
     * @param user user to grant and revoke the roles
     * @param grantRoles the roles to be granted
     * @param revokeRoles the roles to be revoked
     */
    setRoles: function (user, grantRoles, revokeRoles) {
        pdp.grantRoles(user, grantRoles)
        pdp.revokeRoles(user, revokeRoles)
    },

    getRoles: function (user) {
        const arr = pdp.userRoles(user)
        return arr
    },

    hasPermission: function (permission) {
        return function (req, res, next) {
            let roles
            const user = UserAccessDB.getUser(req.cookies.session_id)
            if (!user.roles) {
                user.roles = [{checked: true, name:"userWithNoRoles"}]
            }
            roles = user.roles

            if(pdp.login(user.displayName, roles.map(role => { return role.name }))){
                if (pdp.isPermitted(user.displayName, permission)) {
                    return next()
                }
            }

            res.redirect('/')
            // const error = new Error("Access Denied")
            // error.status = 403
            // next(error)
        }
    }
}