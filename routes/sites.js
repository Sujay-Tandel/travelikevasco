var express = require("express");
var router = express.Router();
var Site = require("../models/site");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    
    // Get all campgrounds from DB
    Site.find({}, function(err, allSites){
       if(err){
           console.log(err);
       } else {
          res.render("sites/index",{sites:allSites});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to sites array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author= {
        id: req.user._id,
        username: req.user.username
    };
    var newSite = {name: name, image: image, description: desc, author: author};
    // Create a new campground and save to DB
    Site.create(newSite, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to sites page
            res.redirect("/sites");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("sites/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Site.findById(req.params.id).populate("comments").exec(function(err, foundSite){
        if(err){
            console.log(err);
        } else {
            console.log(foundSite)
            //render show template with that site
            Site.find({}, function(err, allSites){
                if(err){
                    console.log(err);
                } else {
                    res.render("sites/show", {site: foundSite, sites: allSites});
                }
            });
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkSiteOwnership, function(req, res){
        Site.findById(req.params.id, function(err, foundSite){
            res.render("sites/edit", {site: foundSite});
        });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkSiteOwnership, function(req, res){
    //find and update the correct site
    Site.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedSite){
        if(err){
            res.redirect("/sites");
        } else {
            res.redirect("/sites/" + req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkSiteOwnership, function(req, res){
    Site.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.rediect("/sites");
        } else {
            res.redirect("/sites");
        }
    });
});

module.exports = router;
