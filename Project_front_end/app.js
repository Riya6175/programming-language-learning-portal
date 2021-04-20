const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get('/', function(req, res) {
    res.render('index');
    });

app.get('/home', function(req, res) {
  res.render('home');
  });

  app.get('/about', function(req, res) {
    res.render('about');
    });

  app.get('/overview', function(req,res){
    res.render('overview');
  });

  app.get('/editor', function(req,res){
    res.render('editor');
  });
  
  app.get('/login-signup',function(req,res){
    res.render('login-signup');
  });
  

app.listen(3000, function(){
  console.log("Server started at 3000.");
})

