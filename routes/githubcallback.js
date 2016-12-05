"use strict";

const express = require('express')
const router = express.Router()

/* GET github callback authentication page. */
router.get('/', function(req, res, next) {
    if(req.query.error) return next(new Error(req.query.error))
    console.log('Request code: ' + req.query.code)
    res.end()
})

module.exports = router
