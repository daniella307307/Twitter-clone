const mongoose = require('mongoose');
require('dotenv').config();


const uri = process.env.DB_URI;



async function connectToMongoDB() {
 mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
 .then(()=>{
    console.log('Connected to Mongodb');
 })
 .catch(error =>{
    console.error('Error connecting to MongoDB:', error);
 })
}

module.exports=connectToMongoDB;
