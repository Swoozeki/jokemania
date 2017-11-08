const mongoose = require('mongoose');
const bcrypt= require('bcrypt');

const UserSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});

//hash password before new user is saved
UserSchema.pre('save', function(next){
  const saltRounds= 10;
  bcrypt.hash(this.password, saltRounds, (err, hash)=>{
    if(err){return next(err);}
    this.password =  hash;
    next();
  });
});

UserSchema.statics.authenticate = function(username, password, callback){
  this.findOne({username: new RegExp(username, 'i')}, function(err, user){
    if(err){return callback(err);}
    if(!user){
      const err = new Error('User not found!')
      err.status = 401;
      return callback(err);
    }
    //compare the hashed password
    bcrypt.compare(password, user.password, function(err, match){
      if(match){
        callback(null, user);
      }
      else{
        const err = new Error('Incorrect Password!')
        err.status = 401;
        return callback(err);
      }
    });
  });
};

UserSchema
  .virtual('url')
  .get(function(){
    return `/${this.username}`;
  })

module.exports= mongoose.model('User', UserSchema);
