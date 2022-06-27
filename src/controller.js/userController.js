const userModel = require('../models/userModel');
const bcrypt = require('bcrypt')
const { uploadFile } = require('../utility/aws')
const { SuggestUserName } = require('../utility/validation')

const createUser = async (req, res) => {
    try {
        let data = req.body;

        let { firstName, lastName, userName, gender, email, phone, password, profileImage, postCount, posts, bio, noOfFollower, followers, following, isDeleted, isDeactivated, deletedAt } = data;

        //unique fields validation
        let checkEmail = await userModel.findOne({ email });
        if (checkEmail) {
            return res.status(400).send({
                status: false,
                message: `${email} already exist use different email`,
            });
        }
        let checkPhone = await userModel.findOne({ phone });
        if (checkPhone) {
            return res.status(400).send({
                status: false,
                message: `${phone} already exist use different phone number`,
            });
        }

        //suggest available userName
        let checkUserName = await userModel.findOne({ userName });
        if (checkUserName) {
            let availableUserName = SuggestUserName(userName)
            console.log("availableUserName", availableUserName)
            return res.status(400).send({
                status: false,
                message: `${userName} not available. This is available ${availableUserName}`,
            });
        }

        //encrypt password
        data.password = await bcrypt.hash(password, 10);


        //-----------------upload profileImage---------------------

        // let files = req.files;
        // console.log(files)
        // if (files && files.length > 0) {
        //     //upload to s3 and get the uploaded link
        //     // res.send the link back to frontend/postman
        //     let uploadProfileImage = await uploadFile(files[0]); //upload file
        //     profileImage = uploadProfileImage;
        // } else {
        //     return res
        //         .status(400)
        //         .send({ status: false, message: "please upload profile image" });
        // }


        const user = await userModel.create(data);
        res.status(201).send({ status: true, data: user })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

const updateUser = async (req,res) => {
    let userId = req.params.userId
    let data = req.body
    let files = req.files

    // if(files && files.length > 0){
    //     const updatedImg = await uploadFile(files[0])
    //     updateObj["profileImage"] = updatedImg
    // }

    if(data.hasOwnProperty('email')){
        return res.status(400).send({status: false, message: "Email can't be updated"})
    }
    if(data.hasOwnProperty('password')){
        return res.status(400).send({status: false, message: "Password can't be updated"})
    }

    const userUpdate = await userModel.findByIdAndUpdate(userId, data, {new : true});
    return res.status(200).send({status: true, message: "Updated", data: userUpdate})

}

module.exports = { createUser, updateUser }