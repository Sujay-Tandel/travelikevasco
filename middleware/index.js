var Site = require("../models/site");
var Comment = require("../models/comment");
//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkSiteOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Site.findById(req.params.id, function(err, foundSite){
            if(err){
                req.flash("error", "Site not found.");
                res.redirect("back");
            } else {
                // Added this block, to check if foundSite exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                if (!foundSite) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
                //does user own the campground?
                if(foundSite.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have the permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // Added this block, to check if foundSite exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                if (!foundComment) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
                //does user own the comments?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have the permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj;