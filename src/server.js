

const express = require('express');

const validator = require('validator');
const {adminAuth,userAuth} = require('./middlewares/auth');
const User = require('./models/user');
const { validatorForSignup } = require('./utils/validations');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const authRoute = require('./routes/auth.js')
const profileRoute = require('./routes/profile.js')
const requestRoute = require('./routes/request.js')
const userRoute = require('./routes/user.js')
const cors = require('cors')


require('dotenv').config();

require('./config/db')


const app = express()

app.use(cors(
    {origin:'http://localhost:5173/',
    credentials:true}
));
const PORT = process.env.PORT;



app.use(express.json())
app.use(cookieParser());



app.use('/',authRoute)
app.use('/',profileRoute)
app.use('/request',requestRoute)
app.use('/user',userRoute)







app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})