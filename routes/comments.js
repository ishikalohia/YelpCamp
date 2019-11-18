var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware/index.js")

//NEW COMMENT page
router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err, foundcampground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground: foundcampground});
		}
	})
});

//CREATE COMMENT page
router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
			res.redirect("/campground");
		}else{
			Comment.create(req.body.comment,function(err, comment){
				if(err){
					console.log(err);
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment")
					res.redirect("/campground/" + campground._id);
				}
			})
		}
	})
})

//COMMENT EDIT
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id,function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
		}
    })
})

//COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedComment){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campground/" + req.params.id);
		}
	})
})

//COMMENT DESTROY
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment Deleted");
			res.redirect("back");
		}
	})
})


module.exports = router;
