var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware/index.js")
//===================
//CAMPGROUND ROUTES
//===================

//INDEX Page
router.get("/",function(req,res){
	Campground.find({},function(err,allcampground){
		if(err){
			console.log(err);
		}else{
			res.render('campgrounds/index',{campground: allcampground, page: "campground"});
		}
	})
})

//CREATE 
router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newcampground = {name: name,price: price, image: image, description: desc, author: author};
	Campground.create(newcampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campground");
		}
	})
})

//NEW 
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render('campgrounds/new.ejs');
})

//SHOW
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
		if(err){
			console.log(err);
		}else{
			res.render('campgrounds/show.ejs',{campground: foundcampground});
		}
	})
})

// EDIT ROUTES
router.get("/:id/edit",middleware.checkUserOwnership, function(req,res){
	Campground.findById(req.params.id,function(err, foundcampground){
		res.render("campgrounds/edit",{campground: foundcampground});
	});
});	

router.put("/:id",middleware.checkUserOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campground/" + req.params.id);
		}
	})
})

//DESTROY ROUTES

router.delete("/:id",middleware.checkUserOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campground");
		}else{
			res.redirect("/campground");
		}
	})	
})

module.exports = router;