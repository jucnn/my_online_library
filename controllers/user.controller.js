/*
Imports
*/

// Secure
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");


//Inner
const UserModel = require("../models/user.schema");
const BookModel = require("../models/book.schema");


exports.register = (req, res) => {
    // Save user data
    const params = req.body;
    bcrypt
        .hash(params.password, saltRounds)
        .then(hash => {
            // Change user password with password hashed
            params.password = hash;

            UserModel.create(params)
                .then(document =>
                    res.status(201).json({
                        method: "POST",
                        route: `/api/register`,
                        data: document,
                        error: null,
                        status: 201
                    })
                )
                .catch(err =>
                    res.status(502).json({
                        method: "POST",
                        route: `/api/register`,
                        data: null,
                        error: err,
                        status: 502
                    })
                );
        })
        .catch(hashError =>
            res.status(500).json({
                method: "POST",
                route: `/api/register`,
                data: null,
                error: hashError,
                status: 500
            })
        );
}


exports.login = (req, res) => {
    const params = req.body;

    UserModel.findOne({
            email: params.email
        },
        (err, user) => {
            if (err) {
                return res.status(500).json({
                    method: "POST",
                    route: `/api/login`,
                    data: null,
                    error: err,
                    status: 500
                });
            } else {
                // Load hash from your password DB.
                const password = bcrypt.compareSync(params.password, user.password);
                let token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    },
                    process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );

                if (password) {
                    return res.status(201).json({
                        method: "POST",
                        route: `/api/login`,
                        data: {
                            user,
                            token
                        },
                        error: null,
                        status: 201
                    });

                } else {
                    return res.status(201).json({
                        method: "POST",
                        route: `/api/login`,
                        data: null,
                        error: "Invalid password",
                        status: 500
                    });
                }
            }
        }
    );
}

exports.getInfoUser = (req, res) => {
    UserModel.findById(req.userId, {
        password: 0
    }, (err, user) => {
        if (err) {
            return res.status(500).send({
                err: err
            })
        } else if (!user) {
            return res.status(404).send({
                msg: 'No user found'
            })
        } else {
            res.status(200).json({
                data: user,
            })
        }
    })
}

exports.getOneUser = (req, res) => {
    UserModel.findById(req.params.id)
        .then(document =>
            res.status(200).json({
                method: "GET",
                route: `/api/user/${req.params.id}`,
                data: document,
                error: null,
                status: 200
            })
        )
        .catch(err =>
            res.status(502).json({
                method: "GET",
                route: `/api/user/${req.params.id}`,
                data: null,
                error: err,
                status: 502
            })
        );
}

// exports.addFavorites = (req, res) => {
//     UserModel.findById(req.params.id)
//     .then(document =>{

//     })
// }