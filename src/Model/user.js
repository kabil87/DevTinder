const mongoose = require('mongoose');
const validator =  require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 2,
        maxLength : 30
    },

    lastName : String,

    emailId : {
        type : String,
        required : true,
        unique :  true,
        trim : true,
        lowercase : true,
        maxLength : 50,
        validate(value){
            if(! validator.isEmail(value)){
                throw new Error ("email  is not valid")
            }
        }
    },

    password : {
        type : String,
        required : true,
        trim : true,
        validate(value){
            if (! validator.isStrongPassword(value)){
                throw new Error ("password is not strong enough")
            }
        }
    },

    gender : {
        type : String,
        validate(value){
            if (! ["male","female","other"].includes(value)){
            throw new Error("gender data is not valid")
        }
    },
  },

    age : {
        type : Number,
        min : 15
    },

    skills : {
        type : [String],
        validate(value){
            if (value.length > 30){
                throw new Error("you can add maximum 30 skills");
            }
        }
    },
    description : {
        type : String,
        default : "you can describe yourself here"
    },

    photoUrl : {
        type : String,
        default  : "https://plus.unsplash.com/premium_vector-1683140924463-adba1c428d66?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
},{timestamps : true});

userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id : user._id},"DEV@Tinder$87",{expiresIn : "7d"})
    return token;
};
userSchema.methods.isPasswordMatch = async function(password){
    const user = this;
    const isPasswordMatch =  await bcrypt.compare(password,user.password);   
    return isPasswordMatch;    
}

module.exports = mongoose.model("User",userSchema);