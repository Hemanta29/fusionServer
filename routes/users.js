var express = require('express');
var User = require("../models/user");
var authenticate = require('../authenticate');
const bodyParser = require('body-parser');

var passport = require('passport');

const userRouter = express.Router();

userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
        });
      }
    });
});

userRouter.post('/login', passport.authenticate('local', {
  session: false
}), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token, status: 'You are successfully logged in!' });
})

userRouter.get('/logout', (req, res, next) => {
  if (req.session.passport) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = userRouter;
