var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Sites     = require("./models/site"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    siteRoutes = require("./routes/sites"),
    indexRoutes      = require("./routes/index");
    
// mongoose.connect("mongodb://localhost/travel_like_vasco");
mongoose.connect("mongodb+srv://sujay:Code1110@travellikevasco-w53j3.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();  //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Go, fly, roam, travel, voyage, explore, journey, discover, adventure.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/sites", siteRoutes);
app.use("/sites/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Travel Like Vasco Server Has Started!");
});