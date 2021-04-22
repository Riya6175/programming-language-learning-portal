require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const fs = require("fs");
app.use(express.json());
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));




app.use(express.urlencoded({extended:false}));

app.use(session({
  secret: "this is little secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//________________data-base connection-----------------
mongoose.connect("mongodb://localhost:27017/userDetails", {useNewUrlParser:true,
useUnifiedTopology: true,
useCreateIndex:true
});
mongoose.set("useCreateIndex",true);
//--------------registeration user scehma------------------
const userSchema = new mongoose.Schema({
  username: {
      type: String,
      //required: true
  },
  Email: {
      type: String,
      //required: true,
      unique: true
  },
  password:{
      type: String,
      //required: true
  }
});
userSchema.plugin(passportLocalMongoose);
//------------------model---------------------------------------
const User = new mongoose.model("User",userSchema);

//module.exports = User;

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.render('index');
    });

app.get('/home', function(req, res) {
  res.render('home');
  });

  app.get('/about', function(req, res) {
    res.render('about');
    });

  app.get('/introduction', function(req,res){
    res.render('introduction');
  });

  app.get('/overview', function(req,res){
    res.render('overview');
  });

  app.get('/environment-setup', function(req,res){
    res.render('environment-setup');
  });
  
  app.get('/login-signup',function(req,res){
    res.render('login-signup');
  });


  app.get("/editor",function(req,res){
    if(req.isAuthenticated()){
      res.render("editor");
    }else{
      res.redirect("/login-signup");
    }
  });

  app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
  });
//-----------------post - request for login-signup-------------------------------------------
  app.post("/login", function(req,res){
    const user = new User({
      username: req.body.username,
      Password: req.body.password
    });
    
    req.login(user, function(err){
      if(err){
        console.log(err);
      }
      else{
        passport.authenticate("local")(req, res, function(){
          res.redirect("/editor");
        });
      }
    });
  });

  
  app.post("/signup", function(req,res){
    User.register({username: req.body.username,Email:req.body.Email},req.body.password, function(err,user){
      if(err){
        console.log(err);
        res.redirect("/login-signup");
      }else{
        passport.authenticate("local")(req, res, function(){
          res.redirect("/editor");
        });
      }
    });
  });

  
//--------------Editor related code---------------
//--------------do not touch this part------------

app.post('/', function(req,res){
  var data = req.body.editor;
  console.log("Going to write into existing file")});

//--------------------listning to server(do not touch)------------------------------
app.listen(port, function(){
  console.log(`server running on port ${port}`);
});
