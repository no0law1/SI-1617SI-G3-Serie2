"use strict"

const tokens = {}

const utils = require('./Utils')

module.exports = {

    /**
     * Retrieves access token referenced by key
     *
     * @param key reference to access token of a user
     * @return access token of the user
     */
    getAccessToken: function(key){
        return tokens[key]
    },

    /**
     * Puts an access token and returns the id of the access token
     *
     * @param value
     * @return {number} id
     */
    putAccessToken: function (value) {
        const key = utils.generateUID()
        tokens[key] = value
        return key
    },

    removeAccessToken: function (key) {
        delete tokens[key]
    }

}