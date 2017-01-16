"use strict"

/**
 * Adds csrf token to locals to be rendered to view
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = function (req, res, next) {
    res.locals._csrf = req.csrfToken()
    next()
}