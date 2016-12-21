"use strict"

const memory = {}

const crypto = require('crypto')
const key = 'demo'
const encoding = 'base64'

let counter = 0
const N = 160
function getRandomArbitrary(min = 0, max = N) {
    return Math.random() * (max - min) + min;
}

function getNewID(){
    return crypto.createHmac('sha256', key)
        .update(String((counter++) + getRandomArbitrary()))
        .digest(encoding)
}

module.exports = {

    /**
     *
     * @param id
     * @return {*}
     */
    getUser: function (id) {
        return memory[id]
    },

    /**
     *
     * @param user
     * @return {*}
     */
    insertUser: function (user) {
        const id = getNewID()
        memory[id] = user
        return id
    },

    /**
     *
     * @param id
     */
    removeUser: function (id) {
        delete memory[id]
    },
}