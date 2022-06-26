const userModel = require('../models/userModel')
//suggest available username
let SuggestUserName = (inputUserName) => {

    inputUserName = inputUserName + Math.floor(Math.random() * (999 + 1));
    // console.log(inputUserName)
    // let checkAgain = await userModel.findOne({ userName: inputUserName })


    // console.log(checkAgain)
    // if (checkAgain) {
    //     console.log(true)
    //     SuggestUserName(inputUserName)
    // }

    return inputUserName;


}

const validFileRegex = /^.+\.(?:(?:[dD][oO][cC][xX]?)|(?:[pP][dD][fF])|(?:[pP][nN][gG])|(?:[jJ][pP][gG]))$/


module.exports = { validFileRegex, SuggestUserName }