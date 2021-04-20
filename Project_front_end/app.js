const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");


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

  app.get('/overview', function(req,res){
    res.render('overview');
  })
  
  app.get('/login-signup',function(req,res){
    res.render('login-signup');
  });

//----------adding details to database---------------------
  app.post("/login-signup",function(req,res){
    try {
      const newUser = new Register({
        Username: req.body.Username,
        Email: req.body.Email,
        Password: req.body.Password
      });
        newUser.save();
        res.render("editor");
    } catch (error) {
      res.status(400).send(error);
    }
     
  });

app.listen(port, function(){
  console.log(`server running on port ${port}`);
});
