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




const cmd = require('node-cmd');
const jq = require('jquery')


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

  

  app.get('/editor',function(req,res){
    res.render('editor');
  });

  app.get('/output',function(req,res){
    res.render('output');
  });

  app.get('/functions',function(req,res){
    res.render('functions');
  });

  app.get('/decision-making',function(req,res){
    res.render('decision-making');
  });

  app.get('/loops',function(req,res){
    res.render('loops');
  });

  app.get('/numbers',function(req,res){
    res.render('numbers');
  });

  app.get('/strings',function(req,res){
    res.render('strings');
  });

  app.get('/lists',function(req,res){
    res.render('lists');
  });

  app.get('/tuples',function(req,res){
    res.render('tuples');
  });

  app.get('/dictionary',function(req,res){
    res.render('dictionary');
  });

  app.get('/date-time',function(req,res){
    res.render('dictionary');
  });

  app.get('/functions',function(req,res){
    res.render('functions');
  });

  app.get('/modules',function(req,res){
    res.render('modules');
  });

  app.get('/fileio',function(req,res){
    res.render('fileio');
  });

  app.get('/exceptions',function(req,res){
    res.render('exceptions');
  });

  app.get('/class-objects',function(req,res){
    res.render('class-objects');
  });


//--------------Editor related code---------------
//--------------do not touch this part------------
//------------------------------------------------
var data_output = "";
app.post('/output', function(req,res){
  var data_input = req.body.editor;

  fs.writeFile('code.py', data_input, function(err) {
      if (err) {
          return console.error(err);
      }
  });
  
  cmd.runSync('python code.py');
  cmd.run('python code.py',
  function(err, data, stderr, res){
    if(stderr)
    {
      data_output = stderr;
    }
    else{
      data_output = data;
    }
    
  });
  // res.send(data_output);
  // setTimeout(() => {  res.send(data_output); }, 2000);
});

app.get('/button_api', function(req, res) {
  exports.getTeamData = function () {
};
res.send(data_output);
});
  


//--------------------listning to server(do not touch)------------------------------

//----------adding details to database---------------------
  app.post("/login-signup",function(req,res){
    try {
      const newUser = new Register({
        Username: req.body.Username,
        Email: req.body.Email,
        Password: req.body.Password
      });
        newUser.save();
        res.render("c-editor");
    } catch (error) {
      res.status(400).send(error);
    }

  });


app.listen(port, function(){
  console.log(`server running on port ${port}`);
});
