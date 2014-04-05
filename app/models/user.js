var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema;


var ObjectId = Schema.ObjectId
var userSchema = mongoose.Schema({
   _id:ObjectId,
   username: String,
   password: String
});



// Methods
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    //return bcrypt.compareSync(password, this.password);
    return password == this.password;
};


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
userSchema.methods.serializeUser = function(user, done) {
  done(null, user.id);
};

userSchema.methods.deserializeUser = function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
};

userSchema.methods.findById = function(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
};


userSchema.plugin(passportLocalMongoose);

//module.exports = mongoose.model('user', userSchema);
mongoose.model('user', userSchema,'user');
