const express = require('express');
const app = express();
const connectDb = require('./Config/database');
const User = require("./Model/user");


app.post("/signup",async (req,res) => {

    const userObj = {
        firstName : "kapil",
        lastName : "desh",
        emailId : "kapil@gmail.com",
        password : "12345"
    }

    const user = new User(userObj);

    try {

        await user.save();
        res.status(201).send("user successfully added");
    } 
    catch(err){
        res.status(400).send(err.message);
    }

   

} )

connectDb()
.then(() => {
    console.log("DataBase connection Established...");
    app.listen(7777,()=>{
    console.log("Server is Listening on Port 7777...");  
})})
.catch((err) => console.log("Database can not be Established..."))


