const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const cmd = require('node-cmd');

//________________data-base connection-----------------
mongoose.connect("mongodb://localhost:27017/userDetails", {useNewUrlParser:true,
useUnifiedTopology: true,
useCreateIndex:true
}).then(() => {
    console.log("connection successfull");
}).catch((e) => {
    console.log('no connection');
});
//--------------registeration user scehma------------------
const userSchema = new mongoose.Schema({
  Username: {
      type: String,
      required: true
  },
  Email: {
      type: String,
      required: true,
      unique: true
  },
  Password:{
      type: String,
      required: true
  }
});

//------------------model---------------------------------------
const Register = new mongoose.model("Register",userSchema);

module.exports = Register;

//const Register = require = ("./src/models/register");

const port = process.env.PORT || 3000;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(express.json());

app.use(express.urlencoded({extended:false}));

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

app.listen(port, function(){
  console.log('server running on port ${port}');
});
