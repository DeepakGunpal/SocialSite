require('dotenv').config();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt')
const { uploadFile } = require('../utility/aws')
const { SuggestUserName, isValidBody, isValidEmail, isValidObjectId } = require('../utility/validation');
const { validate, exists } = require('../models/userModel');

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
            let availableUserName = SuggestUserName(userName);
            let checkAgain = await userModel.findOne({ userName: availableUserName });
            if (checkAgain) availableUserName = SuggestUserName(userName);

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
const loginUser = async (req, res) => {
    try {
        let data = req.body
        // condition to check body should not be empty
        if (!data) {
            return res.status(400).send({ status: false, message: "plz enter emailId and password" })
        }
        let { email, password } = data
        if (!valid(email)) {
            return res.status(400).send({ status: false, message: "email is required" })
        }
        //  email validation
        // user

        if (!valid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }
        password = password.trim()
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

        let fName = emailCheck.firstName
        let lName = emailCheck.lastName
        let userId = emailCheck._id
        const token = jwt.sign(
            {
                userId: userId
            },
            process.env.SecretKey, { expiresIn: "24hr" }
        );

        return res.status(200).send({ message: ` welcome ${fName}  ${lName}` })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

    // credential should be present
    // verify the correct format of email and password
    // compate password with bycript
    // generate token after successful varification
    // send token in responce

}

///  = Delete API's
const userDelete = async function (req, res) {
    try{
        let userId = req.params.userId   // input user's ID (authentic)
        let data = req.body
        // Authorization here
         
        // empty body check
        if(!isValidBody(data)) return 'please enter a User Id to delete';
        if(!isValidBody(userId) || !isValidObjectId(userId))  return 'please enter your valid user Id in Params'
        if(!isValidObjectId(data.userId) || isValidBody(data.userId)) return 'please enter a valid user Id'

        // validation & DB call for exist check
        const existCheck = await userModel.findOneAndUpdate({_id: data.userId, isDeleted:false}, {isDeleted:true, deletedAt: Date.now()}, {new: true})

        //if does not exist
        if(!existCheck) return 'user does not exists'
        //giving response
        res.status(201).send({status: true, message: 'User Deleted Successfully', data: existCheck})
    }

    catch(err){
        res.status(500).send({status: false, message: 'err.Message'})
    }   

}

// Follower Api's
const following = async function (req, res) {
    try{
        let userId = req.params.userId
        let data = req.body
        //  Validation and empty check
        if(!isValidBody(userId) || !isValidObjectId(userId)) return ' Please!, enter your valid userId in Params'
        if(!isValidBody(data)) return 'Please!, fill mandatory fields to run this functionality'

        if(!isValidObjectId(data.userId)|| !isValidBody(data.userId)) return 'Please!, enter a valid Object Id of the person whom you want to follow'

        // DB call for Id check( if we're going to update things while checking and in the time of second ID check if we'll not get any result then the First updation will getting false so............)
        /**
         * kya function bana ke invocation kiya ja skta h?
         * kya dono ko hi && operator ke saath if condition me daal ke run kara du  -- but shaayd wo read karne ke saath saath hi update bhi kar dega
         *  solution by me = ek ka existance check kar lete h, dusre me findoneAndUpdate laga dunga.
         */

        const userCheck = await userModel.findOne({_id: userId, isDelted: false})
        if (!userCheck) return 'UserId given in Params does not exists'

        const followingUpdate = await userModel.findOneAndUpdate({_id:data.userId, isDeleted: false},{$inc:{following:+1}, $push:{following:userId}}, {new:true})
        if(!followingUpdate) return "follower profile does't exists"

        const userUpdate = await userModel.findOneAndUpdate({_id:userId, isDelted:false}, {$push:{followers:data.userId}}, {new:true})

        res.status(201).send({status:true, message: `you followed ${data.userId}`})

    }
    catch(err){
        res.status(500).send({status: false, message:'err.Message'})
    }
}




module.exports = { createUser, loginUser, userDelete, following }




// ============    ANKIT'S WORK ===========
/**
 * follower controller - on click - path params would have authencitcated user ID,
 *  body me jisko follow karna h uski user id jayegi, hit karte hi, sweta didi ka ek following count +1 karna h, aur uske array me ankit ki detail aayegi.
 * 
 * ankit ki id me follwer count +1 hoga, follower ke array me sweta didi aa jayengi. 
 */