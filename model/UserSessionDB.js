"use strict"

const utils = require('./Utils')

const memory = {}

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
        const id = utils.generateUID()
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