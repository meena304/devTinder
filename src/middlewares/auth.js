const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.userAuth = async (req,res,next) => {

    try{

    const {token} = req.cookies;

    if(!token){
        res.status(401).json({'message': 'Please Login'})
    }

    const decoded = await jwt.verify(token,'Dev@Tinder4')

    const {_id} = decoded
    if(!_id){
        throw new Error("Invalid token");
    }

    const user = await User.findById(_id)

    if(!user){
        throw new Error("User not found");
    }

    req.user = user

    next();

    }catch(error){
        res.status(400).send(error.message)
    }

   
}