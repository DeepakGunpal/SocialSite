const userModel = require('../models/userModel');
const bcrypt =require("bcryptjs")

const createUser = async (req, res) => {
    try {
        data = req.body;
        const user = await userModel.create(data);
        res.status(201).send({ status: true, data: user })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}
const loginUser = async(req,res)=>{
    try {
        let data = req.body
         // condition to check body should not be empty
         if(!data){
            return res.status(400).send({status:false,message:"plz enter emailId and password"})
         }
         let {email,password} =data
         if(!valid(email)){
            return res.status(400).send({status:false,message:"email is required"})
         }
        //  email validation
        // user

         if(!valid(password)){
            return res.status(400).send({status:false,message:"password is required"})
         }
         password=password.trim()
        //  password Validation

        const emailCheck = await userModel.findOne({ email: email })
        if (!emailCheck) {
            return res.status(404).send({ status: false, message: "Email not found" })
        }

        const dbPassword = emailCheck.password
        
        const passwordMathched = await bcrypt.compare(password, dbPassword)
        if (!passwordMathched) {
            return res.status(401).send({ status: false, message: "Please provide valid credentils" })
        }

        let fName =emailCheck.firstName
        let lName = emailCheck.lastName
        let userId=emailCheck._id
        const token =jwt.sign(
            {
                userId:userId
            },
            "rtyrufycdtr3343##$",{expiresIn:"24hr"}
        );

        return res.status(200).send({ message:` welcome ${fName}  ${lName}`})

    } catch (error) {
        res.status(500).send({ status: false, message: error.message }) 
    }
   
    // credential should be present
    // verify the correct format of email and password
    // compate password with bycript
    // generate token after successful varification
    // send token in responce

}

module.exports = { createUser,loginUser }