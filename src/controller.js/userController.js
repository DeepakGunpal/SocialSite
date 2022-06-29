require("dotenv").config();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { uploadFile } = require("../utility/aws");
const { SuggestUserName, isValidObjectId, isValidPass } = require("../utility/validation");

//checking user exists or not
const isValidUser = async function (value) {
  //-------------------should it for user value wherever required
  let user = await userModel.findOne({ _id: value });
  return user;
};
const userNameCheck = async function (value) {
  let user = await userModel.findOne({ userName: value });
  return user;
};

const createUser = async (req, res) => {
  try {
    let data = req.body;

    let {
      firstName,
      lastName,
      userName,
      gender,
      email,
      phone,
      password,
      profileImage,
      postCount,
      posts,
      bio,
      noOfFollower,
      followers,
      following,
      isDeleted,
      isDeactivated,
      deletedAt,
    } = data;

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
    res.status(201).send({ status: true, data: user });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    let data = req.body;
    // condition to check body should not be empty
    if (!data) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter emailId and password" });
    }
    let { email, password } = data;
    if (!valid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }
    //  email validation
    // user
    if (!valid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }
    password = password.trim();
    //  password Validation

    const emailCheck = await userModel.findOne({ email: email });
    if (!emailCheck) {
      return res
        .status(404)
        .send({ status: false, message: "Email not found" });
    }

    const dbPassword = emailCheck.password;

    const passwordMathched = await bcrypt.compare(password, dbPassword);
    if (!passwordMathched) {
      return res
        .status(401)
        .send({ status: false, message: "Please provide valid credentils" });
    }

    let fName = emailCheck.firstName;
    let lName = emailCheck.lastName;
    let userId = emailCheck._id;
    const token = jwt.sign(
      {
        userId: userId,
      },
      process.env.SecretKey,
      { expiresIn: "24hr" }
    );

    return res.status(200).send({ message: ` welcome ${fName}  ${lName}` });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }

  // credential should be present
  // verify the correct format of email and password
  // compate password with bycript
  // generate token after successful varification
  // send token in responce
};

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
    const userN = await userNameCheck(data["userName"]);
    if (userN) {
      return res
        .status(400)
        .send({ status: false, message: "This User Name is not available. " });
    }
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
  if(!isValidPass(newPassword)){
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
    .send({ status: true, message: "Password Updated Succefully"});
};

module.exports = { createUser, loginUser, updateUser, updatePassword };
