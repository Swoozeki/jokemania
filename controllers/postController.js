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
      res.redirect(`/post/${post._id}`);
    });
  });
};

exports.post_get = function(req, res, next){
  Post.getPost(req.params.id, function(err, post){
    if(err){return next(err);}
    if(!post){return next(new Error('Sorry, no such post exists!'));}

    // res.send(post.postTitle);
    // req.session.previousPostId = post._id;
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

/*
  Store and update a vote
*/
exports.post_vote_post = function(req, res, next){
  if(!req.user) return res.send(false);
  Post.findById(req.params.id)
    .exec(function(err, post){
      if(err){return next(err);}
      if(!post){return next(new Error('Could not find the post. Sorry, it mustve been deleted!'));}

      const userIndexUpvotes = post.upvotes.indexOf(req.user._id);
      const userIndexDownvotes = post.downvotes.indexOf(req.user._id);

      if(req.params.vote === 'upvote'){
        if(userIndexUpvotes>=0) post.upvotes.splice(userIndexUpvotes, 1);
        else{
          if(userIndexDownvotes>=0) post.downvotes.splice(userIndexDownvotes, 1);
          post.upvotes.push(req.user._id);
        }
      }else if(req.params.vote === 'downvote'){
        if(userIndexDownvotes>=0) post.downvotes.splice(userIndexDownvotes, 1);
        else{
          if(userIndexUpvotes>=0) post.upvotes.splice(userIndexUpvotes, 1);
          post.downvotes.push(req.user._id);
        }
      }

      post.save(function(err){
        if(err){return next(err);}
        return res.send({upvotes:post.upvotes.length, downvotes: post.downvotes.length});
      });
    });
}
