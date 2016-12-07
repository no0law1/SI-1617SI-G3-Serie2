"use strict"

const tokens = {}

const crypto = require('crypto')
const key = 'demo'
const encoding = 'base64'

let counter = 0
const N = 160
function getRandomArbitrary(min = 0, max = N) {
    return Math.random() * (max - min) + min;
}

function getNewID(){
    return crypto.createHmac('sha256', key).update(String((counter++) + getRandomArbitrary())).digest(encoding)
}

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
        const key = getNewID()
        tokens[key] = value
        return key
    },

}