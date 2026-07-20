const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const route = express.Router()
const validator = require('validator');
const { validatorForEditProfile } = require('../utils/validations');
const bcrypt = require('bcrypt');

route.get('/profile/view', userAuth, async (req,res)=>{
    try{


        const user = req.user


        res.status(200).send(user)

    }catch(error){
        res.send("ERROR:"+error.message)
    }
})

route.post('/profile/edit',userAuth, async(req,res)=>{

    try{

        validatorForEditProfile(req);

        if(!validator.isURL(req.body.profile)){
            throw new Error("Invalid profile URL");
        }

        const loogedInUSer = req.user;

        console.log(loogedInUSer)

        Object.keys(req.body).forEach((keys)=>loogedInUSer[keys] = req.body[keys])

        await loogedInUSer.save()

        res.status(201).json({"message":"Date updated",data : loogedInUSer})
        
        

    }catch(error){
        res.send('ERROR : ' + error.message)
    }

})


route.post('/profile/password',userAuth,async (req,res)=>{
    try {
        const {currentPassword , newPassword} = req.body;
        const user = req.user;
        const isCorrectPassword = await bcrypt.compare(currentPassword,user.password);

        if(!isCorrectPassword){
            throw new Error("Incoorect old password")
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Weak password"); 
        }

        if(currentPassword==newPassword){
            throw new Error("Choose another password")
        }

        const hassedPassword = await bcrypt.hash(newPassword,10);
        console.log()
        user.password = hassedPassword;
        await user.save();

        res.status(200).json({"message":"Password chnaged successfully","data":user})
    } catch (error) {
        res.status(400).json({"message":"ERROR : "+error.message })
    }
})

// route.get("/feed",async (req,res)=>{
//     const users = await User.find()
//     try {
//         res.status(200).send(users);
//     } catch (error) {
//         res.status(401).send(error)
//     }
// })
// route.get("/user",async (req,res)=>{
//     const {email} = req.body;
//     const user = await User.findOne({email:email})
//     try {
//         res.status(200).send(user);
//     } catch (error) {
//         res.status(401).send(error)
//     }
// })

// route.delete("/user",async (req,res)=>{
//     const {id} = req.body;
//     const user = await User.findById  AndDelete(id)
//     try {
//         res.status(200).send(user);
//     } catch (error) {
//         res.status(401).send(error)
//     }
// })

// route.patch("/user/:id",async (req,res)=>{
//     // const {email} = req.body;
//     console.log(validator.isURL(req.body.profile))
//     const {id} = req.params
  

//     try {
//           const user = await User.findByIdAndUpdate(id,req.body,{runValidators:true});
//     // const user = await User.findOneAndUpdate({email:email},req.body,{returnDocument:"after"})
//         res.status(200).send(user);
//     } catch (error) {
//         res.status(401).send(error.message)
//     }
// })




module.exports = route