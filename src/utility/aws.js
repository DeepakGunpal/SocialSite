import aws from "aws-sdk";
import { validFileRegex } from "../utility/validation.js";

//-------------------aws-----------------------------------------

aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1",
});

let uploadFile = (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: "2006-03-01" }); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",     //access control list
            Bucket: "classroom-training-bucket", //HERE
            Key: "profileImage/" + file.originalname, //HERE
            Body: file.buffer,
        };

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ error: err.message });
            }
            if (!validFileRegex.test(file.originalname)) {
                return reject({ status: false, message: "Invalid file" })
            }

            console.log("file uploaded succesfully");
            return resolve(data.Location); //link generated
        });

    });
};

export { uploadFile };
