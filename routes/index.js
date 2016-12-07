const express = require('express')
const router = express.Router()

/**
 * GET index page.
 */
router.get('/', function(req, res, next) {
  if(req.cookies.google_id){
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

module.exports = router
