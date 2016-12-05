"use strict"

const config = require('../config')

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(config.token){
        //Authenticated
        res.render('home', {
            username: JSON.stringify(config.token)
        })
    }
    else {
        const error = new Error('Unauthorized')
        error.status = 401
        next(error)
    }
});

module.exports = router;