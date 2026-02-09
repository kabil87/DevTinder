const express = require("express");
const { userAuth } = require("../Middleware/auth");
const ConnectionRequest = require("../Model/ConnectionRequest");
const user = require("../Model/user");
const userRouter  = express.Router();


userRouter.get("/user/request/received", userAuth, async (req,res) => {

    try{

        const loggedInUser = req.user;

        const data = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId","firstName lastName age gender description photoUrl")

        res.json({message : "Users Fetched Successfully", data : data})

    }
    catch(err){
        res.status(400).send("Error : "+err.message)
    }
});

userRouter.get("/user/request/connections", userAuth, async (req,res) => {

    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {fromUserId : loggedInUser._id, status : "accepted"},
                {toUserId : loggedInUser._id, status : "accepted"}
            ]
        }).populate("fromUserId", "firstName lastName age gender photoUrl description")
          .populate("toUserId", "firstName lastName age gender photoUrl description")

          console.log(connectionRequest);
          
        
        const data = connectionRequest.map(row => {

            if (loggedInUser._id.toString() === row.fromUserId._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
            
        })

        res.json({message : "Your Friends", data : data})

    }
    catch(err){
        res.status(400).send({message : err.message})
    }
});

userRouter.get("/feed",userAuth, async (req,res)=>{

    try {

        const loggedInUser = req.user;

       const connectionRequest = await ConnectionRequest.find({
        $or : [
           { fromUserId : loggedInUser._id}, {toUserId : loggedInUser._id}
        ]
    }).select("fromUserId toUserId")

    const hideUsers = new Set();

    connectionRequest.forEach((req) => {
        hideUsers.add(req.fromUserId.toString());
        hideUsers.add(req.toUserId.toString());
    });

    const data = await user.find({
        _id : {$nin:Array.from(hideUsers)}
    }).select("firstName lastName age gender photoUrl description")

    res.json({message : "Users", data : data})

    }
    catch(err){
        res.status(400).send("Error : "+err.message)
    }
})

module.exports = userRouter;