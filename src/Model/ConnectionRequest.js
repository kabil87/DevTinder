const mongoose  = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },

    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : "User"
    },

    status : {
        type : String,
        enum : {
            values : ["ignored","interested","accepted","rejected"],
            message : `{VALUE} is incorrect status type`
        }
    }
}, {timestamps : true}
)

connectionRequestSchema.pre("save",async function(){
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error ("You Cannot make a connection to yourself")
    }
    
})

module.exports =  new mongoose.model("ConnectionRequest",connectionRequestSchema);

