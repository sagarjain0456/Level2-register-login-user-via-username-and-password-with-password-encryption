//jshint esversion: 6

const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
// mongoose helps to connect with the database

const app=express();

app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended: true}));

//(1) We have to provide the URL where our MongoDB
// database is located which is our localhost 27017
// which is the default port for the mongoDB

//(2) Then we have to provide the name of our
// database, let it be called as userDB

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// Now we have to make the schema of our newly
//created database called as userDB.
// const userSchema = {
//   email: String,
//   password: String
// };

// Now we have to change the above schema
// in order to allow enctyption of the passoword
//Now this below userSchema is no longer just a
// simple javascript object. Now it is an object that is
// created from the mongoose schema class

const userSchema = new mongoose.Schema ({
email: String,
password: String
});


// To encrypt we have two ways using this mongoose encryption
// package

// 1 way: is to create encryption key and sign in key

// 2nd way: is more convenience, which is to pass in a single
// secret string instead of two keys


const secret = "Mynameissagarjain";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });












//Now we have to use the schema to create our user model
//Then after .model inside the brackets we have to provide
// the singular name of the collection which we chose as
// User then after comma we write userSchema as model created
// using that schema.

const User = new mongoose.model("User", userSchema);


//Now we can start creating users and adding it to the userDB
// named database


app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");

});



app.get("/signup.html", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});




app.get("/login.html", function(req, res){
  res.sendFile(__dirname + "/login.html");
});




// Starting of the Handling of post request for signup.html route

app.post("/signup.html", function(req,res){
 const newUser = new User({
   email: req.body.email,
   password: req.body.password
 });


 newUser.save(function(err){
   if(err){
     console.log(err);
   }

   else{
     res.sendFile( __dirname + "/aftersignup.html");
   }

 });
})
// End of handling of the post request for signup.html route







// Starting of the Handling of post request for login.html route


app.post("/login.html", function(req,res){
const username = req.body.email;
const password = req.body.password;

//User is the name of the collection
User.findOne({email: username}, function(err, foundUser){
  if(err){
    console.log(err);
  }

  else{
    if(foundUser){
      if(foundUser.password === password){
        res.sendFile(__dirname + "/aftersignup.html");
      }
    }
  }

});

});









app.listen(3000, function(){
  console.log("Server started on port 3000");
});
