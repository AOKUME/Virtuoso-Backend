const userAuth = require("./functions/UserAuth.js");
const db = require("../models");

exports.create = async ({body}, res) => {
    if (!userAuth.exists(body)) {
        return res.status(400).json({ success: false, error: "No body or null body received." }).end()
    }
    const User = new db.User(body);
    if (!userAuth.exists(User)) {
        return res.status(400).json({
            success: false,
            error: 'You must provide all the required information for the form!'
        }).end()
    }
    if (await userAuth.existingEmail(User.email)) {
        return res.status(409).json({ success: false, error: "Email already exists" }).end();
    } else {
        User
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: User._id,
                message: 'User created!',
            }).end()
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'User not created!',
            }).end()
        })
    }
}

exports.update = async (req,res) => {
    const {body} = req;
    if (!userAuth.exists(body)) {
        return res.status(400).json({ success: false, error: "No body or null body received." }).end()
    }
    const User = new db.User(body);
    if (!userAuth.exists(User)) {
        return res.status(400).json({
            success: false,
            error: 'You must provide all the required information for the form!'
        }).end()
    }
    
    db.User.findOne({ _id: User.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            }).end()
        }
        user.email = body.email
        user.password = body.password
        user.favorite = body.favorite
        user.registered = body.registered
        user.completedVideo = body.completedVideo
        user.passedQuiz = body.passedQuiz
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: user._id,
                    message: 'User updated!',
                }).end()
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                }).end()
            })
    })
}

exports.delete = async (req,res) => {
    await db.User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err }).end()
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` }).end()
        }

        return res.status(200).json({ success: true, data: user }).end()
    }).catch(err => console.log(err))
}

exports.getId = async (req,res) => {
    await db.User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err }).end()
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` }).end()
        }
        return res.status(200).json({ success: true, data: user }).end()
    }).catch(err => console.log(err))
}

exports.getAll = async (req,res) => {
    await db.User.find({}, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!user.length) {
            return res
                .status(404)
                .json({ success: false, error: `Users not found` }).end()
        }
        return res.status(200).json({ success: true, data: user }).end()
    }).catch(err => console.log(err))
}

exports.verifyUser = async ({body},res) => {
    if (!userAuth.exists(body)) {
        return res.status(400).json({ success: false, error: "No body or null body received." }).end()
    }
    const User = new db.User(body);
    if (!userAuth.exists(User)) {
        return res.status(400).json({
            success: false,
            error: 'You must provide all the required information for the form!'
        }).end()
    }
    await db.User.findOne({ email: User.email, password: User.password }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` }).end()
        }
        return res.status(200).json({ success: true, data: user }).end()
    }).catch(err => console.log(err))
}