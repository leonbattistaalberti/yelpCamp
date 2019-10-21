var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")

// INDEX ROUTE
router.get('/', function(req, res) {
	Campground.find({}, function(err, allCamps) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/allCamps", {
				camps: allCamps, currentUser: req.user
			});
		}
	});
});

//=======================================
// POST ROUTE FOR CREATING NEW CAMPGROUND
// 2nd: CREATE NEW CAMPGROUND
//=======================================

router.post('/', isLoggedIn, function(req, res) {
	var name = req.body.campName;
	var image = req.body.imageURL;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {
		name: name,
		image: image,
		description : desc,
		author: author
	};
	console.log(req.user);
	// create new campground and save to database
	Campground.create(newCampground, function (err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			console.log(newlyCreated)
			res.redirect('/campgrounds')
	console.log("Welcome to the post page. I am Werner Herzog of the Herzog and Herzog Trust")
		}
	});
});

//==============================
// FORM TO CREATE NEW CAMPGROUND
//==============================

router.get('/new', isLoggedIn, function(req, res) {
	res.render("campgrounds/new")
});

//==============================
// MORE INFO ON A CAMPGROUND
//==============================

router.get('/:id', function(req, res){
	// FIND CAMPGROUND BY ID
	// DON'T UNDERSTAND THE POPULATE FUNCTION
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
	if (err) {
			console.log(err)
		} else {
//			console.log(foundCampground)
			res.render('campgrounds/show', {camp: foundCampground })
		}		
	});
});

// EDIT ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground:foundCampground})
	});
});

// UPDATE ROUTE
router.put("/:id", checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
		if(err){
			res.redirect("campgrounds/edit");
		} else {
			res.redirect("campgrounds/" + req.params.id)
		}
	});
});

// REMOVE campground
router.delete("/:id", checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
		if(err){
			console.log(err)
		}	else {
			res.redirect("/campgrounds");
		}	
	});

});

// LOGIN CHECK FUNCTION
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
};

// AUTHORIZATION MIDDLEWARE

function checkCampgroundOwnership(req,res,next){
		if (req.isAuthenticated()) {
			Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("back")
		} else {
			// check authorization
			if (foundCampground.author.id.equals(req.user._id)) {
				next();
			} else {
				res.redirect("back")
			}
		}
	});	
		} else{
			res.redirect("back");
		} 

}
module.exports = router;



