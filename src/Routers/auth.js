const express = require("express");
const { validation } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt")
const User = require("../Model/user");

const validator = require("validator");

authRouter.post("/signup",async (req,res) => {

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
});

authRouter.post("/login", async (req,res) => {

    try {

    const {emailId,password} = req.body;
 
    if (! validator.isEmail(emailId)){
  
        throw new Error ("Invalid Credentials")
    }

    const user = await User.findOne({emailId : emailId});

    const isPasswordMatch = user && await user.isPasswordMatch(password);
    
    if (isPasswordMatch){

        const token = await user.getJWT();
        
        res.cookie("token",token);
        res.send(user);
    }
    else {
        throw new Error("Invalid Credentials")
    }
   

    }
    catch(err){
        res.status(400).send(err.message)
    }
});

authRouter.post("/logout",(req,res)=>{

    res.cookie("token",null, {expires : new Date(Date.now()) });
    res.send("Logout successful")
})

module.exports = authRouter;


