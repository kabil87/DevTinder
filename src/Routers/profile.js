const express = require("express");
const { userAuth } = require("../Middleware/auth");
const { validateFields } = require("../utils/validation");
const validator = require("validator")
const profileRouter = express.Router();
const bcrypt = require("bcrypt")

profileRouter.get("/profile/view", userAuth, async (req,res)=> {

    try{    

        const user = req.user;
        res.send(user)
    
    }
    catch(err){
        res.status(401).send("Please login to access profile")
    }
})

profileRouter.patch("/profile/update", userAuth, async (req,res) => {

    try {

        if(!validateFields(req)){
        throw new Error("cannot Update");
    }

    const loggedInUser = req.user;

     Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key])
    await loggedInUser.save();

    res.json({
        message : "User Profile Updated Successfully",
        date : loggedInUser
    })
    
    }
    catch(err){
        res.status(400).send("Error : "+err.message )
    }
} )

profileRouter.patch("/profile/passwordUpdate",userAuth, async (req,res) => {

    try{
        const {password} = req.body;

    if (!validator.isStrongPassword(password)){
        throw new Error("Password is Not Strong Enough")
    }

    const passwordHash = await bcrypt.hash(password,10);

    const loggedInUser = req.user;

    loggedInUser.password = passwordHash;

    loggedInUser.save();

    res.send("Password Updated Successfully");

    }
    catch(err){
        res.status(400).send("Error : "+err.message)
    }
} )

module.exports = profileRouter;