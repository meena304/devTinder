const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const route = express.Router();



route.get("/request/received",userAuth,async (req,res)=>{
   try{

    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({toUserId:loggedInUser._id,status:'interested'}).populate('fromUserId',['firstName','lastName','profile']).populate('toUserId',['firstName','lastName','profile']);




    res.status(200).json({"message":"Connection Request Found",data:connectionRequest})

   }catch(error){
    res.status(400).json({"Error":error.message})
   }
})


route.get('/connections',userAuth,async(req,res)=>{
    try{

        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({status:'accepted',$or : [
            {fromUserId : loggedInUser._id },{toUserId : loggedInUser._id}
        ]}).populate("fromUserId",['firstName','lastName','profile']).populate("toUserId",['firstName','lastName','profile'])

        const data = connections.map((row)=>{
             console.log(row.fromUserId._id.toString(),loggedInUser._id)
            if(row.fromUserId._id.toString()===(loggedInUser._id).toString()){
                console.log('1')
                return row.toUserId
            }

                console.log('2')

            return row.fromUserId
        })

        res.status(200).json({"message":"Connections List","data":data})
 
    }catch(error){
        res.status(400).json({"Error":error.message})
    }
})

route.get('/feed',userAuth,async (req,res)=>{
    try{

        const loggedInUser = req.user;
        const {page,per_page} = req.query

        const limit = per_page;
        const skip = (page-1)*limit
        console.log(page,per_page,limit,skip)

        const connects = await ConnectionRequest.find({
            $or : [
                {fromUserId : loggedInUser._id},{toUserId:loggedInUser._id}
            ]
        }).select('fromUserId toUserId')

        const hideUser = new Set();

        connects.forEach((row)=>{
            hideUser.add(row.fromUserId.toString())
            hideUser.add(row.toUserId.toString())

        })


        console.log(Array.from(hideUser))


       

        const feeds = await User.find({_id:{$nin : Array.from(hideUser),$ne:loggedInUser._id}}).skip(skip).limit(limit)

        res.status(200).json({"message":"Feed List","data":feeds,"page":page,"total":feeds.length})
    }catch(error){
        res.status(400).json({"ERROR":error.message})
    }
})



module.exports = route