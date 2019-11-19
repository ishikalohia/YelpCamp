var express       = require('express'),
    app           = express(),
    bodyparser    = require('body-parser'),
    mongoose      = require('mongoose'),
	flash         = require('connect-flash'),
    passport      = require('passport'),
    localStrategy = require('passport-local'),
	methodOverride= require('method-override'),
    Campground    = require("./models/campground.js"),
    Comment       = require("./models/comment.js"),
	User          = require("./models/user.js"),
    seedDB        = require("./seeds");


var commentRoutes    = require("./routes/comments.js"),
	campgroundRoutes = require("./routes/campgrounds.js"),
	authRoutes       = require("./routes/index.js");
	
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
//console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb+srv://ishika:ishika8457@cluster0-7gyqr.mongodb.net/test?retryWrites=true&w=majority").then(()=>{ console.log("Connected to DB")}).catch(err => {console.log("ERROR:", err.message)}
//);
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//seedDB();

app.use(require("express-session")({
	secret: "This is the best app",
	resave: false,
	saveUninitialized: false
}))

//Passport Configration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();	
})

app.use("/campground/:id/comments",commentRoutes);
app.use("/campground",campgroundRoutes);
app.use(authRoutes);

app.listen(process.env.PORT || 3600,function(req,res){
	console.log("YelpCamp server started");
})
