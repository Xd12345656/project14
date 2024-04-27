var express=require("express")
var bodyParser=require("body-parser")
var mongoose=require("mongoose")
const { MongoClient } = require('mongodb');
const fs = require('fs');
// const { JSDOM } = require('jsdom');

const app=express()
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))


//Connect your Databse
mongoose.connect('mongodb://localhost:27017/WebD')
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))





//Server Functions

var bookingSchema = new mongoose.Schema({
    place: String,
    guests: Number,
    arrival: Date,
    leaving: Date
});

// Create a model
var Booking = mongoose.model('Booking', bookingSchema);

// Handle POST request to /book
// Handle POST request to /book
app.post("/book", (req, res) => {
    // Extract data from the request body
    var place = req.body.place;
    var guests = req.body.guests;
    var arrival = req.body.arrival;
    var leaving = req.body.leaving;

    // Create a new Booking document
    var newBooking = new Booking({
        place: place,
        guests: guests,
        arrival: arrival,
        leaving: leaving
    });

    // Save the new booking to the database
    newBooking.save()
        .then(result => {
            console.log("Booking saved successfully:", result);
            res.redirect('success.html')
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error saving booking details");
        });
});



app.post("/signup",(req,res) => {
    var usr_name = req.body.usr_name
    var usr_pass = req.body.usr_pass
    var usr_mail = req.body.usr_mail
    // var usr_dob = req.body.usr_dob
    // var usr_email = req.body.usr_email

    var data={
        "userName":usr_name,
        "password":usr_pass,
        "Email":usr_mail
        // "dob":usr_dob,
        // "email":usr_email
    }
    db.collection('users').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record Inserted Succesfully")
    })
    return res.redirect('login.html')
})


app.post('/log', async (req, res) => {
  var usr_name = req.body.username;
  var pass = req.body.user_pass; 
  console.log(usr_name);
  console.log(pass);
  try {
    const user = await db.collection('users').findOne({ password:pass, userName:usr_name });
    
    if (user) {
      console.log("Access Given!");
      return  res.redirect('home.html');
    } else {
      console.log("Invalid Credintials!");
      console.log("Error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//Parent run Code

//Get into Frontend
app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('home.html');
}).listen(3000);

console.log("Listening on port 3000");