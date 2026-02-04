const jwt = require ("jsonwebtoken");
const User = require("../Model/user");


const userAuth = async(req,res,next)=>{

    try {

        const {token} = req.cookies;

    if (! token){
        return res.status(401).send("Token is Not Valid");
    }

    const decoded = jwt.verify(token,"DEV@Tinder$87");

    const user = await User.findById(decoded._id);

    if (!user){
        return res.status(400).send("User Not Found");
    }
    else {
        req.user = user;
        next();
    }

    }
    catch(err){
        return res.send("Error : "+ err.message)
    }

}

module.exports = {
    userAuth
}