const Post = require('../models/post');

exports.posts_get= function(req, res, next){
  Post.getPosts(req.requestedUser, function(err, posts){
    if(err){return next(err);}
    // console.log(posts);
    res.render('index',{title: req.requestedUser?req.requestedUser.username:'all', user: req.user, posts: posts});
  });
};

exports.random_post_get = function(req, res, next){
  Post.count().exec(function(err, count){
    if(err){return next(err);}
    const random = Math.floor(Math.random()* count);

    Post.findOne().skip(random).exec(function(err, post){
      res.redirect(`/${post._id}`);
    });
  });
};

exports.post_get = function(req, res, next){
  Post.getPost(req.params.id, function(err, post){
    if(err){return next(err);}
    if(!post){return next(new Error('Sorry, no such post exists!'));}

    // res.send(post.postTitle);
    res.render('post', {user:req.user, post: post});
  });
};

exports.post_post = function(req, res, next){
  if(req.user){
    const post = new Post({
      postTitle: req.body['post-title'],
      postBody: req.body['post-body'],
      user: req.user._id,
      upvotes: [],
      downvotes: []
    });

    post.save(function(err){
      if(err){return next(err);}
      res.redirect('/');
    });
  }
};
