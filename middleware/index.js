var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};
middlewareObj.checkGroundOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
			Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("back")
		} else {
			// check authorization
			if (foundCampground.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that")
				res.redirect("back")
			}
		}
	});	
		} else{
			
			res.redirect("back");
		} 
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
			Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err) {
			res.redirect("back")
		} else {
			// check authorization
			if (foundComment.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that")
				res.redirect("back")
			}
		}
	});	
		} else{
			res.redirect("back");
		}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	
	if(req.isAuthenticated()){
		return next();
	}
	
	
	
	req.flash("error", "Please log in first")
	res.redirect('/login');
};	


module.export = middlewareObj;