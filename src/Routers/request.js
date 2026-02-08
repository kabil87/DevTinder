const express = require("express");
const { userAuth } = require("../Middleware/auth");
const ConnectionRequest = require("../Model/ConnectionRequest");
const user = require("../Model/user");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async (req,res) => {

    try{

        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const isAllowedStatus = ["ignored","interested"];

        if (! isAllowedStatus.includes(status)){
            throw new Error("Status Type is not valid")
        };

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        });

        if (existingConnectionRequest){
            return res.status(400).json({message : "Connection Request Made Already"})
        }


        const toUser = await user.findById(toUserId);

        if (! toUser){
            return res.status(400).json({message : "User Not Found!"})
        }

        const data = await connectionRequest.save();

        res.json({
            message : "Connection request Send Successfully",
            data : data
        })

    }
    catch(err){
        res.status(400).send("Error : "+err.message)
    }

});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {

    // Validate status,  // status should be interested,  // loggesdinUserId => toUserId, // validate requestId
    try{

    const loggedInUserId = req.user._id;
    const loggedInUserName = req.user.firstName;
    const {status,requestId} = req.params;

    const isAllowedStatus = ["accepted","rejected"];
    if (!isAllowedStatus.includes(status)){
        return res.status(400).json({message : "Status is Not Valid"})
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id : requestId,
        toUserId : loggedInUserId,
        status : "interested"
    })

    if (!connectionRequest){
        throw new Error("User Not Found!")
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.send(loggedInUserName + " "+ status + " "+"Your Request");

    }
    catch(err){
        res.status(400).send("Error : "+err.message)
    }

} )

module.exports = requestRouter;