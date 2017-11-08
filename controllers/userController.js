const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.register_user_post = function(req, res, next){
  req.checkBody('username').notEmpty().withMessage('Username must not be empty')
  req.checkBody('password', 'Password must not be empty').notEmpty();

  req.sanitize('username').escape();
  req.sanitize('username').trim()
  req.sanitize('password').escape();
  req.sanitize('password').trim();

  const errors = req.validationErrors();

  const user = new User({
    username: req.body.username,
    password: req.body.password //is hashed by the UserSchema.pre function before save
  });

  if(errors){
    res.send("well, this sucks!");
  }

  // if an account with username is already in database, then pass error to the error-handler middleware. Otherwise, save the user in database.
  User.findOne({username: new RegExp(user.username,'i')}, function(err, match){
    if(err){return next(err);}

    if(match){
      const err = new Error('Account already exists!');
      err.status = 401;
      return next(err);
    }
    else{
      user.save(function(err){
        if(err){return next(err);}
        req.session.userId = user._id;
        // res.send("Yatta, that worked!");
        res.redirect('/');
      });
    }
  });

};

exports.login_user_post = function(req, res, next){
  req.checkBody('username').notEmpty().withMessage('Username must not be empty')
  req.checkBody('password', 'Password must not be empty').notEmpty();

  req.sanitize('username').escape();
  req.sanitize('username').trim()
  req.sanitize('password').escape();
  req.sanitize('password').trim();

  const errors = req.validationErrors();
  if(errors) res.send("well, this sucks!");

  //authenticate user, and start new user session if valid
  User.authenticate(req.body.username, req.body.password, function(err, user){
    if(err) return next(err);

    req.session.userId = user._id;
    res.redirect('/');
  })
}

exports.logout_user_post = function(req, res, next){
  req.session.destroy(err => {
    if(err){return next(err);}
    else res.redirect('/');
  });
};
