const mongoose = require('mongoose')

async function connectToDB() {
   const res =  await mongoose.connect(process.env.DB_URI) 
   if(res) {
     console.log('Connected to DB')
   } else {
     console.log('Failed to connect to DB')
   }
}

module.exports = connectToDB;
