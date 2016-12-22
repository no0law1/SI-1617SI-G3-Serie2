"use strict"

const crypto = require('crypto')
const key = 'demo'
const encoding = 'base64'

let counter = 0
const N = 160
function getRandomArbitrary(min = 0, max = N) {
    return Math.random() * (max - min) + min;
}

module.exports = {

    generateUID : function () {
        return crypto.createHmac('sha256', key)
            .update(String((counter++) + getRandomArbitrary()))
            .digest(encoding)
    }

}