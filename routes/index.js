const express = require('express')
const router = express.Router()

/* GET index page. */
router.get('/', function(req, res, next) {
  //TODO: home view
  res.render('index', { title: 'Express' })
})

module.exports = router