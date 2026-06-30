const express = require('express');

const app = express()
const PORT = 3000;

app.use("/test",(req,res)=>{
    res.send("Test URL")
})

app.use("/hello",(req,res)=>{
    res.send("Hello Guys")
})
app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})