const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {type : mongoose.Schema.Types.ObjectId,required:true,ref:"User"},
    toUserId : {type : mongoose.Schema.Types.ObjectId,required:true,ref:"User"},
    status : {type:String,enum : {
        values : ['interested','ignored','accepted','rejected'],
        message : `{VALUE} is not a valid status`
    },required:true}

}, {timestamps:true})


connectionRequestSchema.pre('save',function(next){

    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){


        throw new Error('Cannot send connection request to yourself');

        next();

    }

})

connectionRequestSchema.indexes({fromUserId:1,toUserId:1});



const ConnectionRequest = mongoose.model('ConnectionRequest' , connectionRequestSchema)
module.exports = ConnectionRequest;