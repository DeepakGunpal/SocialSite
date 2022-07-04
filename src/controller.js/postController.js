const postModel = require('../models/postModel');
const { isValidBody, isValidObjectId } = require('../utility/validation')
const { uploadFile } = require("../utility/aws");


const updatePost = async (req, res) => {
    try {
        let data = req.body;
        let { post, postId } = data;

        //mandatory fields 
        if (!isValidBody(postId)) {
            return res.status(400).send({
                status: false,
                message: `postId is required`,
            });
        }


        if (!isValidObjectId(postId)) {
            return res
                .status(400)
                .send({ status: false, message: "Please provide correct userId" });
        }

        //-----------------upload profileImage---------------------

        let files = req.files;
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let updatedImg = await uploadFile(files[0]); //upload file
            post = updatedImg;
        } else {
            return res
                .status(400)
                .send({ status: false, message: "please upload post image" });
        }

        let updatedPost = await postModel.findOneAndUpdate({ _id: postId }, data, { new: true });

        res.status(200).send({ status: true, msg: "post updated", data: updatedPost })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { updatePost }