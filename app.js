/**
 * Module dependencies.
 */

var flash = require('connect-flash');
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose')

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path+'/'+file)
})

// Controllers
var stories = require('./app/controllers/stories')

var app = express();
var passport = require('passport')
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.cookieParser('thissecretrocks'));
  app.use(express.bodyParser());
  app.use(express.session({ cookie: { maxAge: 60000 }}));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());


  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// Connect to the db
mongoose.connect('mongodb://localhost/snapstory', function(err) {
	if(err != null) {
		console.log('Error connecting to DB!!!')
		console.log(err)
	}
});

// Passport used for authentication
var LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model('user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(
  function(usernameField, passwordField, done) {
    console.log(usernameField); // debug
    console.log(passwordField); // debug
    User.findOne({'username':usernameField }, function(err, user) {
      if (err) { console.log("in err"); return done(err); }
      if (!user) {
      	console.log("in incorrect username");
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(passwordField)) {
          console.log("in incorrect password");
          return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("credentials matched");
      return done(null, user);
    });
  }
));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Routes
app.get('/', routes.index);
app.get('/stories', ensureAuthenticated, stories.list);

app.post('/login', 
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


