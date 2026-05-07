const mongoose = require("mongoose");

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected to database");
    }).catch(err=>{
        console.log("Error connecting with database");
        process.exit(1); // this line closes the server in case of connection failure with database
    })
}

module.exports = connectToDB;