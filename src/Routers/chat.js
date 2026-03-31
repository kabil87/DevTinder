const express = require("express");
const { userAuth } = require("../Middleware/auth");
const Chat = require("../Model/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targerUserId", userAuth, async(req,res)=>{

    try {
        const userId = req.user._id
        const {targerUserId} = req.params;


    let chat = await Chat.findOne({
        participants : {$all : [userId,targerUserId]}
    }).populate({
        path : "message.senderId",
        select : "firstName"
    })

    if (! chat){
        chat = new Chat({
            participants : [userId,targerUserId],
            message : []
        })
        await chat.save();
    }
    res.json(chat)
    }
    catch(err){console.log(err);
    }
})

module.exports = chatRouter;