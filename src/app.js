const express = require('express');
const app = express();
const connectDb = require('./Config/database');
const User = require("./Model/user");
const { validation } = require('./utils/validation');
const bcrypt = require("bcrypt")
const validator = require("validator")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require('./Middleware/auth');

app.use(express.json());
app.use(cookieParser())

app.post("/signup",async (req,res) => {

    try {
        validation(req);

        const { password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({
        ...req.body,
        password : hashedPassword
    })

        await user.save();
        res.status(201).send("user successfully added");
    } 
    catch(err){
        res.status(400).send("Error : "+err.message);
    }
} )

app.post("/login", async (req,res) => {

    try {

    const {emailId,password} = req.body;
    console.log(emailId,password);
    
    if (! validator.isEmail(emailId)){
  
        throw new Error ("Invalid Credentials")
    }

    const user = await User.findOne({emailId : emailId});

    const isPasswordMatch = user && await user.isPasswordMatch(password);
    
    if (isPasswordMatch){

        const token = await user.getJWT();
        
        res.cookie("token",token);
        res.send("user logged in successfully");
    }
    else {
        throw new Error("Invalid Credentaials")
    }
   

    }
    catch(err){
        res.send("Error : "+ err.message)
    }
} )

app.get("/profile", userAuth, async (req,res)=> {

    try{    

        const user = req.user;
        res.send(user)
    
    }
    catch(err){
        res.status(401).send("Please login to access profile")
    }
})


connectDb()
.then(() => {
    console.log("DataBase connection Established...");
    app.listen(7777,()=>{
    console.log("Server is Listening on Port 7777...");  
})})
.catch((err) => console.log("Database can not be Established..."))


