import  express  from "express";
import mongoose from 'mongoose';
import route from "./route/route.js"
import multer from "multer";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(multer().any());

mongoose.connect(`mongodb+srv://Swetarun:lBf6gTedHw2tfPtQ@cluster0.ebg8a.mongodb.net/socialSite`, {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err, ".......*****......."))

app.use('/', route);

app.all('*', function (req, res) {
    throw new Error("You Hit Wrong Api!!!, Plz Check !!!");
});

app.use(function (e, req, res, next) {
    if (e.message === "You Hit Wrong Api!!!, Plz Check !!!") {
        return res.status(400).send({ status: false, error: e.message });
    }
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000));
});
 
