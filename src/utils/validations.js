const validator = require("validator");


exports.validatorForSignup = (req) => {
    const {firstName , lastName,email,password} = req.body

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(email)){
        throw new Error("Invalid email")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password")
    }
}

exports.validatorForEditProfile = (req) => {

    
        const validEditFields = ['firstName','lastName','age','skills','about','profile']

        const isValid = Object.keys(req.body).every(field=>validEditFields.includes(field))


        return isValid;

    

}