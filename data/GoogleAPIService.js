"use strict"

const request = require('request')

module.exports = {

    /**
     * Retrieve google profile of authenticated user
     *
     * @param userAccessToken google authentication access token
     * @param cb function(err, profile)
     */
    retrieveProfile: function (userAccessToken, cb) {
        const options = {
            url: 'https://www.googleapis.com/plus/v1/people/me',
            headers: {
                'User-Agent': 'node.js',
                'Authorization': 'Bearer ' + userAccessToken,
            }
        }
        request.get(options, function (error, response, body){
            if(error){
                cb(err)
            } else {
                cb(null, body)
            }
        })
    },

    /**
     *  Posts a TaskList to Google Tasks API
     *
     * @param userAccessToken google authentication access token
     * @param body task list to create
     * @param cb function(err, taskListId)
     */
    postTaskList: function (userAccessToken, body, cb) {
        const options = {
            url: 'https://www.googleapis.com/tasks/v1/users/@me/lists',
            body: body,
            headers: {
                'User-Agent': 'node.js',
                'Authorization': 'Bearer ' + userAccessToken,
                'Content-Type': 'application/json',
                'Content-Length': body.length,
            },
        }

        request.post(options, (error, response, body) => {
            if (error) {
                return cb(error)
            }
            cb(null, JSON.parse(body).id)
        })
    },

    /**
     * Posts a Task to a specified TaskList to Google Tasks API
     *
     * @param userAccessToken google authentication access token
     * @param taskListId TaskList ID
     * @param body task to be created
     * @param cb function(err, body)
     */
    postTask: function (userAccessToken, taskListId, body, cb) {
        const options = {
            url: 'https://www.googleapis.com/tasks/v1/lists/' + taskListId + '/tasks',
            body: body,
            headers: {
                'User-Agent': 'node.js',
                'Authorization': 'Bearer ' + userAccessToken,
                'Content-Type': 'application/json',
                'Content-Length': body.length,
            },
        }

        request.post(options, (error, response, body) => {
            if(error){
                return cb(error)
            }
            cb(null, body)
        })
    }
}