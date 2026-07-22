const mongoose = require("mongoose");

const connection = async () =>{
   
    await mongoose.connect(process.env.DB_CONNECTION_SECRET)
}

connection().then(()=>{
    console.log("Connected")
}).catch((err)=>{
 console.log("Not Connected"+err)
})


