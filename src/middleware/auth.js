import jwt from "jsonwebtoken";

const authToken = (token) => {
    let tokenValidate = jwt.verify(token, "secretkey", (err, data) => {
        if (err)
            return null
        else {
            return data
        }
    })
    return tokenValidate
}


const auth = async function (req, res, next) {
    try {
        let token = req.headers["authorization"]
        if (!token) {
            return res.status(401).send({ status: false, message: "token must be present" });
        }
        const bearer = token.split(" ")

        const bearerToken = bearer[1]

        let decodedToken = authToken(bearerToken)
        if (!decodedToken) {
            return res.status(401).send({ status: false, message: "Invalid token" })
        }
        // ask
        req["userId"] = decodedToken.userId

        next()

    }
    catch (error) {
        return res.status(500).send({ status: "Error", error: error.message });

    }
}


const Authorization = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (userId != req.userId) return res.status(403).send({ status: false, message: "Not authorization" })
        console.log("authorized")
        next();
    } catch (error) {
        return res.status(500).send({ status: "Error", error: error.message });
    }
}
export { auth, Authorization }