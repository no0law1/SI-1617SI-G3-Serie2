"use strict"

const pdpFactory = require('policy-decision-point')
const pdp = pdpFactory.initSync('./pdp.json')
const UserAccessDB = require('../../model/UserSessionDB')


module.exports = {

    /**
     * Set's the user's roles
     *
     * @param user user to grant and revoke the roles
     * @param roles the roles to be granted
     * @return returns granted roles
     */
    setRoles: function (user, roles) {
        return pdp.setRoles(user, roles)
    },

    getRoles: function (user) {
        return pdp.userRoles(user)
    },

    hasPermission: function (permission) {
        return function (req, res, next) {
            let roles
            const user = UserAccessDB.getUser(req.cookies.session_id)
            if (!user.roles) {
                user.roles = [{checked: true, name:"userWithNoRoles"}]
            }
            roles = user.roles

            if(pdp.login(user.email, roles.map(role => role.name))){
                if (pdp.isPermitted(user.email, permission)) {
                    return next()
                }
            }

            user.message = {type:'info', message:'You are not permitted. Check your roles'}
            res.redirect('back')
        }
    }
}