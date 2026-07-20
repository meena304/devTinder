const express = require('express');
const User = require('../models/user');
const { validatorForSignup } = require('../utils/validations');
const route = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


route.post("/signup",async (req,res)=>{

    
    try {
        validatorForSignup(req);
        const {firstName , lastName , email,age,gender,password} = req.body;

        const passwordHash = await bcrypt.hash(password,10)

        const userObj = {
        firstName : firstName,
        lastName : lastName,
        email : email,
        age : age,
        gender:gender,
        password   : passwordHash

        }
        const user = new User(userObj)

        await user.save()
        const token = await jwt.sign({_id:user._id},'Dev@Tinder4')
        res.cookie('token',token)
        res.status(201).json({"message":"Signup Successfully",data : user})
    } catch (error) {
        res.status(400).send(error.message)
    }

    
})

route.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email:email})
        if(!user){
            res.status(401).json({"message":"Imvalid credentials","data":[]})
        } 

        const isValidPassword = await bcrypt.compare(password,user.password);
        if(isValidPassword){
            const token = await jwt.sign({_id:user._id},'Dev@Tinder4')
            res.cookie('token',token)
            res.status(200).json({"message":'Login Successfully',"data":user})
        } else{ 
            res.status(400).json({"message":"Imvalid credentials","data":[]})
        }
    } catch (error) {
        res.send('ERROR : '+error.message)
    }
})


route.post('/logout',async(req,res)=>{
    res.cookie('token',null,{
        expires : new Date(Date.now())
    })

    res.send('Logout Successsfully')
})


module.exports = route