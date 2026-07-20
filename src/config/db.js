const mongoose = require("mongoose");

const connection = async () =>{
    await mongoose.connect('mongodb+srv://jsm:jsm123456@cluster0.hu9nwff.mongodb.net/devTinder?appName=Cluster0')
}

connection().then(()=>{
    console.log("Connected")
}).catch((err)=>{
 console.log("Not Connected"+err)
})


