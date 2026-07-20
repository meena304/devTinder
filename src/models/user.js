const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    firstName : {type : String ,required:[true,"This field is required developer"],minLength: 3 , maxLength:50},
    lastName : {type:String},
    email : {type:String,required:true,unique:true,trim:true,lowercase:true,validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email Address");
        }
    }},
    password : {type:String,required:true},
    age: {type:Number,min:18},
    gender : {type:String,validate(value){
        if(!['male','female','other'].includes(value)){
           throw new Error("Invalid gender type")
        }
    }},
    about : {type:String,default: 'This is default password',maxLength: 100},
    profile : {type : String , default : 'https://img.magnific.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',validate(value){
        if(!validator.isURL(value)){
            throw new Error("Invalid url");
            
        }
    }},
    skills : {type:[String]}


},{timestamps:true})

const User = mongoose.model('User',userSchema);

module.exports = User;