var express 			= require("express");
var app 				= express();
var bodyParser 			= require("body-parser");
var mongoose 			= require("mongoose");
var passport 			= require("passport");
var LocalStrategy 		= require("passport-local");
var request 			= require("request");
var methodOverride		= require("method-override");
var flash				= require("connect-flash");
// ROUTES
var	campgroundRoutes	= require("./routes/campgrounds");
var commentRoutes 		= require("./routes/comments");
var authRoutes 			= require("./routes/index");
// MODELS
var Campground 			= require("./models/campground");
var User 				= require("./models/user");
var Comment 			= require("./models/comment");
var seedDB 				= require("./seeds");
//seedDB();

// CURRENT USER
app.use(express.static(__dirname + "/public"));
//mongoose.connect('mongodb://localhost/yelp_camp_v10');
mongoose.connect("mongodb+srv://thelonehegelian:V0fA$0asvs@a@cluster0-lot3f.mongodb.net/test?retryWrites=true&w=majority", {
        useNewUrlParser: true, 
		useCreateIndex : true
    }).then(() => {
	console.log('Connected to DB!');
	
}).catch(err => {
	console.log('ERROR:', err.message);
});
				 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log("MongoDB Working");
});

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.set("view engine", "ejs")

// PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret : "sauce",
	resave : false, 
	saveUninitalized : false 
}));

app.use(flash());
app.use(function(req,res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// PASSPORT SERIALIZATION AND DESERIALIZATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use for the routes
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);

app.listen(3000, () => {
	console.log("And awaaayaay we go!");
});