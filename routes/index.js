var express = require('express');
var router = express.Router();

var post_controller= require('../controllers/postController');
var user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', post_controller.random_post_get);

router.get('/random', post_controller.random_post_get);

router.get('/all', post_controller.posts_get);

router.get('/all/:user',
  function(req, res, next){ //converts user URL parameter to corresponding user object for next middleware
    const User = require('../models/user');

    User.findOne({username:req.params.user}, 'username', function(err, user){
      if(err){return next(err);}
      if(!user){return next(new Error('Sorry, user does not exist!'));}
      req.requestedUser = user;
      return next();
    });
  },
  post_controller.posts_get);

router.get('/:id', post_controller.post_get);


router.post('/register', user_controller.register_user_post);

router.post('/login', user_controller.login_user_post);

router.post('/logout', user_controller.logout_user_post);

router.post('/create', post_controller.post_post);

router.get('/check', function(req, res, next){
  res.send(`You are logged in as ${req.session.userId?req.session.userId:'no one!'}`);
});


module.exports = router;
