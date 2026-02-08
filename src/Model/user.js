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
        default  : "https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png"
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