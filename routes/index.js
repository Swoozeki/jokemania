var express = require('express');
var router = express.Router();

var post_controller= require('../controllers/postController');
var user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', post_controller.random_post_get);

router.get('/post/random', post_controller.random_post_get);

router.get('/all', post_controller.all_posts_get);

router.get('/user/:user', post_controller.user_posts_get);

router.get('/post/:id', post_controller.post_get);

router.post('/post/:id/:vote', post_controller.post_vote_post);

router.post('/register', user_controller.register_user_post);

router.post('/login', user_controller.login_user_post);

router.post('/logout', user_controller.logout_user_post);

router.post('/create', post_controller.post_post);

router.get('/check', function(req, res, next){
  res.send(`You are logged in as ${req.session.userId?req.session.userId:'no one!'}`);
});


module.exports = router;
