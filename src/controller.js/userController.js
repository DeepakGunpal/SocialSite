require("dotenv").config();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { uploadFile } = require("../utility/aws");
const { SuggestUserName, isValidObjectId, isValidPass, isValidBody, enumGender, isValidEmail, isValidPhone } = require("../utility/validation");
const jwt = require("jsonwebtoken")

let user = async (data) => {
  let check = await userModel.findOne(data)
  return check
}


//checking user exists or not 
const isValidUser = async function (value) {
  //-------------------should use it for user value wherever required
  let user = await userModel.findOne({ _id: value });
  return user;
};
// const userNameCheck = async function (value) {
//   let user = await userModel.findOne({ userName: value });
//   return user;
// };

const createUser = async (req, res) => {
  try {
    let data = req.body;

    let {
      firstName, lastName, userName, gender, email, phone, password
    } = data;

    //mandatory fields
    if (!isValidBody(firstName)) {
      return res.status(400).send({
        status: false,
        message: `firstName is required`,
      });
    }
    if (!isValidBody(lastName)) {
      return res.status(400).send({
        status: false,
        message: `lastName is required`,
      });
    }
    if (!isValidBody(userName)) {
      return res.status(400).send({
        status: false,
        message: `userName is required`,
      });
    }
    if (!isValidBody(email) || !isValidEmail(email)) {
      return res.status(400).send({
        status: false,
        message: `Please! enter a valid email.`,
      });
    }
    if (!isValidBody(phone) || !isValidPhone(phone)) {
      return res.status(400).send({
        status: false,
        message: `Please!, enter a valid phone.`,
      });
    }

    if (gender) {
      if (!enumGender(gender)) {
        return res.status(400).send({
          status: false,
          message: `gender should be one of these ${["Male", "Female", "LGBTQ", "Prefer not to say"]}`
        });
      }
    }

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
      let availableUserName = await SuggestUserName(userName);
      return res.status(400).send({
        status: false,
        message: `${userName} not available. This is available ${availableUserName}`,
      });
    }

    //auto generate password if password is missing
    if (!password) {

      function password_generator(len) {
        let length = len ? len : 10;
        let string = "abcdefghijklmnopqrstuvwxyz"; //to upper
        let numeric = "0123456789";
        let punctuation = "#?!@$%^&*-"; //!@#$%^&*()_+~`|}{[]\:;?><,./-=
        let password = "";
        let character = "";
        while (password.length < length) {
          entity1 = Math.ceil(string.length * Math.random() * Math.random());
          entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
          entity3 = Math.ceil(
            punctuation.length * Math.random() * Math.random()
          );
          hold = string.charAt(entity1);
          hold = password.length % 2 == 0 ? hold.toUpperCase() : hold;
          character += hold;
          character += numeric.charAt(entity2);
          character += punctuation.charAt(entity3);
          password = character;
        }
        password = password
          .split("")
          .sort(function () {
            return 0.5 - Math.random();
          })
          .join("");
        return password.slice(0, len);
      }

      data.password = password_generator(8);

    } else {
      if (!isValidPass(data.password)) {
        return res.status(400).send({
          status: false,
          message: `Weak password - password length b/w 8 - 15 characters`,
        });
      }
    }
    let actualPass = data.password;
    //encrypt password
    data.password = await bcrypt.hash(data.password, 10);


    //-----------------upload profileImage---------------------

    let files = req.files;
    if (files && files.length > 0) {
      //upload to s3 and get the uploaded link
      // res.send the link back to frontend/postman
      let uploadProfileImage = await uploadFile(files[0]); //upload file
      profileImage = uploadProfileImage;
    } else {
      return res
        .status(400)
        .send({ status: false, message: "please upload profile image" });
    }


    const user = await userModel.create(data);
    res.status(201).send({ status: true, message: `Registration successfull. login credentials - userName = ${userName} , password = ${actualPass}`, data: user })
  } catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}

//-------------------------------------------------------------------LOGIN-USER---------------------------------------------------------------------//

const loginUser = async (req, res) => {
  try {
    let data = req.body
    // condition to check body should not be empty
    if (!data) {
      return res.status(400).send({ status: false, message: "plz enter emailId and password" })
    }
    let { email, password } = data
    if (!isValidBody(email)) {
      return res.status(400).send({ status: false, message: "email is required" })
    }



    if (!isValidBody(password)) {
      return res.status(400).send({ status: false, message: "password is required" })
    }
    password = password.trim()
    if (!isValidPass(password)) {
      return res.status(400).send({ status: false, message: "enter valid email" })
    }
    //  password Validation

    const emailCheck = await user({ $or: [{ email: email }, { userName: email }] })
    console.log(module);
    if (!emailCheck) {
      return res.status(404).send({ status: false, message: `${email} not found` })
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
    res.setHeader("token", token)
    return res.status(200).send({ message: ` welcome👽👽 ${fName}  ${lName}` })

  } catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }



}


//-------------------------------------------------------updateUser-----------------------------------------------------------------------------//
const updateUser = async (req, res) => {
  let userId = req.params.userId;
  if (!isValidObjectId(userId)) {
    return res
      .status(400)
      .send({ status: false, message: "Please provide correct userId" });
  }
  let userDetail = await isValidUser(userId);
  console.log(userDetail);
  if (!userDetail) {
    return res
      .status(400)
      .send({ status: false, message: "User does not exist" });
  }

  let data = req.body;
  let files = req.files;

  if (files && files.length > 0) {
    const updatedImg = await uploadFile(files[0]);
    data["profileImage"] = updatedImg;
  }

  if (data["userName"]) {
    //suggest available userName
    let checkUserName = await userModel.findOne(data.userName);
    console.log("checkUserName", checkUserName)
    if (checkUserName) {
      let availableUserName = await SuggestUserName(userName);
      return res.status(400).send({
        status: false,
        message: `${userName} not available. This is available ${availableUserName}`,
      });
    }
    // const userN = await userNameCheck(data["userName"]);
    // if (userN) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "This User Name is not available. " });
    // }
  }
  if (data["email"]) {
    return res
      .status(400)
      .send({ status: false, message: "Email can't be updated" });
  }
  if (data["password"]) {
    return res
      .status(400)
      .send({ status: false, message: "Password can't be updated" });
  }

  const userUpdate = await userModel.findByIdAndUpdate(userId, data, {
    new: true,
  });
  return res
    .status(200)
    .send({ status: true, message: "Updated", data: userUpdate });
};

const updatePassword = async function (req, res) {
  let userId = req.params.userId;
  if (!isValidObjectId(userId)) {
    return res
      .status(400)
      .send({ status: false, message: "Please provide correct userId" });
  }
  let userDetail = await isValidUser(userId);
  if (!userDetail) {
    return res
      .status(400)
      .send({ status: false, message: "User does not exist" });
  }
  let data = req.body;

  if (!data) {
    return res
      .status(400)
      .send({ status: false, message: "plz enter old and new password" });
  }

  let { oldPassword, newPassword } = data;
  if (!oldPassword) {
    return res
      .status(400)
      .send({ status: false, message: "Old Password is required" });
  }

  if (!newPassword) {
    return res
      .status(400)
      .send({ status: false, message: "New Password is required" });
  }

  const pswd = await isValidUser(userId);
  const psd = pswd.password
  const passwordMatched = await bcrypt.compare(oldPassword, psd);
  if (!passwordMatched) {
    return res
      .status(401)
      .send({ status: false, message: "Please provide valid password" });
  }
  if (!isValidPass(newPassword)) {
    return res
      .status(400)
      .send({ status: false, message: "Password length should be 8-15" })
  }
  newPassword = await bcrypt.hash(newPassword, 10);

  const psdUpdate = await userModel.findByIdAndUpdate(
    userId,
    { password: newPassword },
    { new: true }
  );

  return res
    .status(200)
    .send({ status: true, message: "Password Updated Succefully" });
};

//------------------------------------------------------get User --------------------------------------------------------------------------//

const getUser = async (req, res) => {

  try {
    let filterQuery = req.query;
    let userId = req.params.userId
    // let tokenId = req.userId

    if (!isValidBody(userId)) {
      return res.status(400).send({ status: false, message: "Please Provide User Id" })
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "invalid userId" })
    }

    // if (!(userId == tokenId)) {
    //     return res.status(401).send({ status: false, message: "Unauthorized User" })
    // }

    let { Name, firstName, Institute, place, email } = filterQuery;


    let query = { isDeleted: false }

    if (Name) {
      query['userName'] = { $regex: Name }
    }

    if (firstName) {
      query['firstName'] = { $regex: firstName }
    }

    if (Institute) {
      query['Institute'] = Institute
    }

    if (place) {
      query['Location'] = place
    }

    if (email) {
      query['email'] = email
    }

    let getAllUser = await userModel.find(query)

    if (getAllUser.length < 0) {
      return res.status(404).send({ status: false, message: "user does not exists from this detail" })
    }
    return res.status(200).send({ status: true, count: getAllUser.length, message: "Success", data: getAllUser })

  }
  catch (error) {
    return res.status(500).send({ status: false, error: error.message })

  }
};

const getRequests = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.userId })
    return res.status(200).send({ status: true, count: user.followersRequest.length, message: "Success", data: user.followersRequest })

  } catch (error) {
    return res.status(500).send({ status: false, error: error.message })

  }
}

///  = Delete API's
const userDelete = async function (req, res) {
  try {
    let userId = req.params.userId   // input user's ID (authentic)
    // let data = req.body
    // Authorization here

    // empty body check
    // if(!isValidBody(data)) return 'please enter a User Id to delete';
    console.log('hello idhar aao')
    if (!isValidBody(userId) || !isValidObjectId(userId)) return res.status(400).send({ msg: 'please enter your valid user Id in Params' })
    // if(!isValidObjectId(data.userId) || isValidBody(data.userId)) return 'please enter a valid user Id'

    // validation & DB call for exist check
    const existCheck = await userModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

    // if does not exist
    if (!existCheck) return res.status(404).send({ msg: 'user does not exists' })
    // giving response
    res.status(204).send({ status: true, message: 'User Deleted Successfully', data: existCheck })
  }

  catch (err) {
    res.status(500).send({ status: false, message: 'err.Message' })
  }

}

// Follower Api's
const following = async function (req, res) {
  try {
    let userId = req.params.userId
    let data = req.body
    //  Validation and empty check
    if (!isValidBody(userId) || !isValidObjectId(userId)) return ' Please!, enter your valid userId in Params'
    if (!isValidBody(data)) return 'Please!, fill mandatory fields to run this functionality'

    if (!isValidObjectId(data.userId) || !isValidBody(data.userId)) return 'Please!, enter a valid Object Id of the person whom you want to follow'

    // DB call for Id check( if we're going to update things while checking and in the time of second ID check if we'll not get any result then the First updation will getting false so............)
    /**
     * kya function bana ke invocation kiya ja skta h?
     * kya dono ko hi && operator ke saath if condition me daal ke run kara du  -- but shaayd wo read karne ke saath saath hi update bhi kar dega
     *  solution by me = ek ka existance check kar lete h, dusre me findoneAndUpdate laga dunga.
     */

    // const userCheck = await userModel.findOne({_id: userId, isDeleted: false})
    // if (!userCheck) return 'UserId given in Params does not exists'
    if (userId == data.userId) return res.status(409).send({ status: false, message: " Not Allowed! " })

    const followersReq = await userModel.findOneAndUpdate({ _id: data.userId, isDeleted: false }, { $addToSet: { followersRequest: userId } }, { new: true })
    if (!followersReq) return res.status(404).send({ status: false, message: "follower profile does't exists" })
    console.log(followersReq)

    // const userUpdate = await userModel.findOneAndUpdate({_id:userId, isDelted:false}, {$push:{followers:data.userId}}, {new:true})

    res.status(200).send({ status: true, message: `you followed ${data.userId}` })

  }
  catch (err) {
    res.status(500).send({ status: false, message: 'err.Message' })
  }
}


const acceptRequest = async (req, res) => {
  try {
    let requestId = req.body.userId
    let user = await userModel.findOne({ _id: req.params.userId })

    let action = req.body.action

    //increase follower count
    for (let i = 0; i < user.followersRequest.length; i++) {
      if (requestId == user.followersRequest[i] && action == 1) {
        await userModel.findOneAndUpdate({ _id: req.params.userId }, { $pull: { followersRequest: user.followersRequest[i] }, $inc: { totalFollower: 1 }, $addToSet: { followers: user.followersRequest[i] } });

        await userModel.findOneAndUpdate({ _id: requestId }, { $inc: { totalFollowing: 1 }, $addToSet: { following: req.params.userId } })

        return res.status(200).send({ status: true, message: `${requestId} started following you` })
      }

      if (requestId == user.followersRequest[i] && action == 0) {
        await userModel.findOneAndUpdate({ _id: req.params.userId }, { $pull: { followersRequest: user.followersRequest[i] } });
        return res.status(400).send({ status: false, message: `${requestId} has rejected` })
      }
    }

    //increase following count
    // const incFollowing = await userModel.findOneAndUpdate({ _id: requestId }, { $inc: { totalFollowing: 1 } , $addToSet:{following:req.params.userId}})

    res.status(400).send({ status: false, message: `${requestId} has not requested to follow you. Enter correct userId, Idiot` })



  } catch (error) {
    return res.status(500).send({ status: false, error: error.message })
  }
}


module.exports = { createUser, loginUser, updateUser, updatePassword, getUser, getRequests, acceptRequest, userDelete, following };
