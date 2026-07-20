const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');

const route = express.Router();


route.get('/send/:status/:toUserId',userAuth,async(req,res)=>{
    try {

        

        const {status,toUserId} = req.params;
        const fromUserId = req.user._id

        console.log(status,toUserId,fromUserId)

        const isValidID = mongoose.isObjectIdOrHexString(toUserId);

        if(!isValidID){
            throw new Error("Invalid connection id");
        }

        const toUser = await User.findById({_id:toUserId});

        if(!toUser){
            throw new Error('User not found!!')
        }

        const validStatus = ['interested','ignored'];

        if(!validStatus.includes(status)){
            throw new Error("Invalid status");
        }

        // if(fromUserId.toString()===toUserId.toString()){
        //     throw new Error('Cannot send connection request to yourself')
        // }

        const existingRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(existingRequest){
            throw new Error('Connection already exists')
        }



        const connectionRequest = new ConnectionRequest({
            fromUserId,toUserId,status,
        })

        const data = await connectionRequest.save();

        res.status(201).json({"message":"Connection store","data": data})
        
    } catch (error) {
        res.status(400).json({"Error":error.message})
    }
})

route.get('/review/:status/:requestId',userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const {status,requestId} = req.params;

        const allowedStatus = ['accepted','rejected'];

        const isStatusAllowed = allowedStatus.includes(status)

        if(!isStatusAllowed){
            throw new Error("Invalid Status");
        }

        console.log(requestId,(loggedInUser._id).toString())

        const connectionRequest = await ConnectionRequest.findOne({_id:requestId, toUserId:loggedInUser._id,status:"interested"});
        console.log(connectionRequest)
        if(!connectionRequest){
            throw new Error("Request not found")
        }

        connectionRequest.status = status;

        connectionRequest.save();


        res.status(201).json({"message":"Connection request is "+status})



    } catch (error) {
        res.status(400).json({"Error":error.message})
    }
})


module.exports = route