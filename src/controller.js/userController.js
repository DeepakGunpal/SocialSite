const userModel = require('../models/userModel');

const createUser = async (req, res) => {
    try {
        data = req.body;
        const user = await userModel.create(data);
        res.status(201).send({ status: true, data: user })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

module.exports = { createUser }