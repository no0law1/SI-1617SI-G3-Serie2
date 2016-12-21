"use strict"

const request = require('request')
const dtoMapper = require('../model/DTOMapper')

module.exports = {

    /**
     * Gets the repos of a specific authenticated user
     *
     * @param userAccessToken github authentication access token
     * @param cb function(error, repos)
     */
    retrieveRepos : function (userAccessToken, cb) {
        const options = {
            url: 'https://api.github.com/user/repos',
            headers: {
                'User-Agent': 'node.js',
                'Authorization': 'token ' + userAccessToken,
            }
        }
        request.get(options, function (error, response, body){
            if(error){
                return cb(error)
            }

            return cb(null, dtoMapper.repos(JSON.parse(body)))
        })
    },

    /**
     * Gets the issues of a specific repository
     *
     * @param name name of the repository
     * @param owner owner of the repository
     * @param userAccessToken github authentication access token
     * @param cb function(error, issues)
     */
    retrieveIssues: function (userAccessToken, name, owner, cb) {
        const options = {
            url: 'https://api.github.com/repos/' + owner + '/' + name + '/issues',
            headers: {
                'User-Agent': 'node.js',
                'Authorization': 'token ' + userAccessToken,
            }
        }

        request.get(options, (error, response, body) => {
            if (error) {
                return cb(error)
            }
            cb(null, dtoMapper.issues(JSON.parse(body)))
        })
    }
}