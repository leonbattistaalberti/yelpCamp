var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROOT PAGE
router.get('/', function(req, res) {
	res.render("./campgrounds/landing");
});

// ============ 
// AUTH ROUTES
// ============

// REGISTER FORM
router.get('/register', function(req, res){
	res.render("campgrounds/register")
});

// SIGN UP HANDLING -- POST ROUTE
router.post('/register', function(req, res) {
	var newUser = new User({username:req.body.username});
	var pass = req.body.password;
	User.register(newUser, pass, function(err, user){
		if (err){
			console.log(err);
			return res.render('/register');
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect('/campgrounds');
		});
	});
});

// LOGIN FORM
router.get('/login', function(req, res){
	res.render("campgrounds/login")
});

// LOGIN HANDLING -- POST ROUTE
router.post('/login', passport.authenticate("local", 
	{
	successRedirect : "/campgrounds",
	failureRedirect : "/login"
	}
	), function(req, res){
});

// LOGOUT ROUTE
router.get('/logout', function(req,res){
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect('/campgrounds');
});

// LOGIN CHECK FUNCTION
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
};

module.exports = router;