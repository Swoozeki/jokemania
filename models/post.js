const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = Schema({
  postTitle: {type: String, required: true},
  postBody: {type: String, required: true},
  user: {type: Schema.ObjectId, ref:'User', required: true},
  upvotes: [{type: Schema.ObjectId, ref:'User'}],
  downvotes: [{type: Schema.ObjectId, ref:'User'}]
});

//posts can be retrieved specific to certain user
PostSchema.statics.getPosts = function(user, callback){
  const conditions = user?{user:user._id}:{};

  this.find(conditions)
    .populate('user')
    .exec(function(err, posts){
      if(err){return callback(err);}
      callback(null, posts);
    });
};

PostSchema.statics.getPost = function(postId, callback){
  if(!postId) return callback(new Error('Sorry, postId was not supplied!'));

  this.findById(postId)
    .populate('user')
    .exec(function(err, post){
      if(err){return callback(err);}
      callback(null, post);
    });
};

PostSchema
  .virtual('url')
  .get(function(){
    return `/post/${this._id}`;
  });

module.exports = mongoose.model('Post', PostSchema);
