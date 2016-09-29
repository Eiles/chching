var Router = require('express').Router;
var passport = require('passport');
var Account = require('../models/account.js');
module.exports = function(app) {

  var router = Router();
  router.post('/login', passport.authenticate('local'), function(req, res) {
    res.send(JSON.stringify({loggedin:1}));
  });

  return router;
};
