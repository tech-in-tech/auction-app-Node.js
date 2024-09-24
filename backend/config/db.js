//* Import mongoose for database connection
const mongoose = require('mongoose');

// *import colors
const color = require('colors');

// *config .env
require('dotenv').config();

// *MongoDB connection URL
const MONGO_URL = process.env.MONGO_URL;

// *mongodb database connection
mongoose.connect(MONGO_URL,{
  useNewUrlParser: true,   // Use the new URL parser instead of the deprecated one
  useUnifiedTopology: true   // Use the new server discovery and monitoring cengine
})

//* Get the default connection
//? Mongoose maintains a default connection object representing MongoDB connection
const db = mongoose.connection;

// * define event listner for database connection
db.on('connected', () => {
  console.log(`connected to MongoDB server ${mongoose.connection.host}`.bgMagenta);
})

// * event listner for any error while connection to database
db.on('error', (error) => {
  console.log("MongoDB connection ERROR :: ", error,bgRed)
})

// * event listner for if database is disconnected 
db.on('disconnected', () => {
  console.log("MongoDB disconnected".bgRed);
})

// ! Export the database connection
module.exports = db;