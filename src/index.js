import express from "express";
import mongoose from 'mongoose';
import route from "./route/route.js"
import multer from "multer";
import fetch from "node-fetch";
// import intro from "../src/Intro.json" assert {type: 'json'}
const app = express();
import { readFile } from 'fs/promises';



app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(multer().any());

mongoose.connect(`mongodb+srv://Swetarun:lBf6gTedHw2tfPtQ@cluster0.ebg8a.mongodb.net/socialSite`, {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err, ".......*****......."))

app.use('/', route);

// app.all('*', function (req, res) {
//     throw new Error("You Hit Wrong Api!!!, Plz Check !!!");
// });

app.all('*', async (req, res) => {
    // if (e.message === "You Hit Wrong Api!!!, Plz Check !!!") {
    //     return res.status(400).send({ status: false, error: e.message });
    // } 

    const json = JSON.parse(await readFile(new URL('./Intro.json', import.meta.url)));
    console.log(json)
    res.status(200).send(json)
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000));
});

