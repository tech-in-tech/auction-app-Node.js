//! Import packages
const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const app = express();
const cors = require("cors");
const dotenv = require('dotenv');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const fileUploade = require('express-fileupload')
const cloudinary  = require('cloudinary')

// !setup cloudinary
cloudinary.v2.config({
  cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
  api_key:process.env.CLOUDINARY_CLIENT_API,
  api_secret:process.env.CLOUDINARY_CLIENT_SECRET
})


//!Middlewares
// Middleware to access data from clint in JSON formate
app.use(express.json())

// Middleware for cross origin error
app.use(cors({
  origin:[process.env.FRONTEND_URL],
  methods:["POST","GET","DELETE","PUT"],
  credentials:true
}));

//* help to access cookies
app.use(cookieParser());
//* return data in json formate
app.use(express.json());  
app.use(express.urlencoded({extended:true}));
app.use(fileUploade({
  useTempFiles:true,
  tempFileDir:"/temp/",
}))

// Middleware which tells us API method , status code and time taken by API
app.use(morgan('dev'));


// route
// URL => http://localhost:4000
app.use("/api/v1/auth",require('./routes/authroutes'))
app.use("/api/v1/user",require('./routes/userRoutes'))
app.use("/api/v1/auction",require('./routes/auctionroutes'))
app.use("/api/v1/bid",require('./routes/bidRoutes'))
app.use("/api/v1/commission",require('./routes/commisionRoutes'))
app.use("/api/v1/supperAdmin",require('./routes/supperAdminRoutes'))

app.get('/',(req,res)=>{
  return res.status(200).json("Welcon to auction server");
}) 


const PORT  = process.env.PORT || 4000;

// Start the server and listen for connections on port 3000
app.listen(PORT,()=>{
  console.log(`Server running on PORT : ${PORT}`.bgCyan);
})
