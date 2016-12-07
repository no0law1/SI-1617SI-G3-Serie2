"use strict"

const config = require('../config')
const accessTokenDB = require('../model/AccessTokenDB')

const express = require('express')
const router = express.Router()

/**
 * GET home page.
 */
router.get('/', function(req, res, next) {
    const id = accessTokenDB.getAccessToken(req.cookies.google_id)
    if(!id){
        res.redirect('/login')
    }
    //Authenticated
    res.render('home')
});

module.exports = router;