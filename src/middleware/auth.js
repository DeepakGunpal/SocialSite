import jwt from "jsonwebtoken";

const authToken = (token) => {
    let tokenValidate = jwt.verify(token, "rtyrufycdtr3343##$", (err, data) => {
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
        console.log(token)
        const bearer = token.split(" ")

        const bearerToken = bearer[1]

        let decodedToken = authToken(bearerToken)
        if (!decodedToken) {
            return res.status(401).send({ status: false, message: "Invalid token" })
        }
        console.log(decodedToken)
        // ask
        req["userId"] = decodedToken.userId

        next()

    }
    catch (error) {
        return res.status(500).send({ status: "Error", error: error.message })

    }
}

export { auth }