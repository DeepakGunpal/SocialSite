import userModel from "../models/userModel.js";
import mongoose from 'mongoose';  //use for object ID validation


//suggest available username
let SuggestUserName = async (inputUserName) => {

    inputUserName = inputUserName + Math.floor(Math.random() * (999 + 1));
    let checkAgain = await userModel.findOne({ userName: inputUserName })
    if (checkAgain) {
        SuggestUserName(inputUserName)
    }

    return inputUserName;
}

const validFileRegex = /^.+\.(?:(?:[dD][oO][cC][xX]?)|(?:[pP][dD][fF])|(?:[pP][nN][gG])|(?:[jJ][pP][gG]))$/


const isValidImageType = function (data) {
    const reg = /^.+\.(?:(?:[dD][oO][cC][xX]?)|(?:[pP][dD][fF])|(?:[pP][nN][gG])|(?:[jJ][pP][gG]))$/
    return reg.test(data)
  }

const enumGender = (gender) => {
    if (!["Male", "Female", "LGBTQ", "Prefer not to say"].includes(gender)) {
        return false;
    }
    return true;

}
///  for empty input

const isValidBody = function (value) {
    if (typeof value == "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === "Number" && value.trim().length === 0) return false
    return true
};

// for phone number
const isValidPhone = function (value) {
    const regx = /^[6-9]\d{9}$/
    return regx.test(value)
};

// for EmailId
const isValidEmail = function (value) {
    const regx = /^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/
    return regx.test(value)
};

// for Object Id validation for futher use
const isValidObjectId = function (value) {
    return mongoose.Types.ObjectId.isValid(value)
};


// for password  constrainde with a Ideal length
const isValidPass = function (password) {
    const regx = /^[0-9a-zA-Z!@#$%&*]{8,15}$/
    return regx.test(password)
};



export { validFileRegex,isValidImageType, SuggestUserName, isValidBody, isValidPhone, isValidEmail, isValidObjectId, isValidPass, enumGender }