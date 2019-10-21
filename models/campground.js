var mongoose = require("mongoose");
var campgroundSchema = mongoose.Schema({
	name: String,
	image: String, 
	description: String, 
	author: {
		id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
		username: String
	},
	// DON'T UNDERSTAND TYPE DATA ASSOCIATION
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", campgroundSchema)