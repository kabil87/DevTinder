 const validator = require("validator")
 
 function validation  (req)  {

    const {firstName, emailId, password} = req.body;
    

    if (! firstName){
        throw new Error("firstName is required")
    }
    else if (! firstName.length > 2 && firstName.length < 30){
        throw new Error("firstName must be between 2 and 30 characters")
    }
    else if (! validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    else if (! validator.isStrongPassword(password)){
        throw new Error("Password is not Strong enough")
    }
 }

 module.exports = {
    validation
 }