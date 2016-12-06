"use strict"

const config = require('../config')

var express = require('express');
var router = express.Router();

/**
 * GET home page.
 */
router.get('/', function(req, res, next) {
    if(!req.cookies.google_token){
        //TODO: set error or redirect to /login?
        const error = new Error('Unauthorized')
        error.status = 401
        return next(error)
    }
    //Authenticated
    res.render('home')
});

module.exports = router;