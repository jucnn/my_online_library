/*
Imports
*/

//Node
const express = require("express");
const router = express.Router();


// Secure
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");


//Inner
const BookModel = require("../models/book.schema");
const UserModel = require("../models/user.schema");
const passport = require('passport');


/*
Routes definition
*/
class CrudRouterClass {
    constructor() {}

    // Set route fonctions
    routes() {


        // Register
        router.post("/register", (req, res) => {
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

        });

        // Login
        router.post("/login", (req, res) => {
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
                        let accessToken = jwt.sign({
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
                                    accessToken
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
        });

        function verifyToken(req, res, next) {
            try {
                const token = req.headers.authorization.split(" ")[1];
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                next();
            } catch (error) {
                res.status(401).json({
                    message: "Authentication failed!"
                });
            }
        }

        router.get('/me', verifyToken, (req, res) => {
            UserModel.findById(req.params.id, (err, user) => {
                if (err) {
                    return res.status(500).send({
                        err: err
                    })
                } else {
                    res.status(200).json({
                        msg: user
                    })
                }
            })
        })

        // Create one item
        router.post("/:endpoint", (req, res) => {
            let data = {};

            if (req.params.endpoint === 'book' || req.params.endpoint === 'favorites') {
                data = {
                    name: req.body.name,
                    author: req.body.author,
                    description: req.body.description,
                }

                BookModel.create(data)
                    .then(document =>
                        res.status(201).json({
                            method: "POST",
                            route: `/api/${req.params.endpoint}`,
                            data: document,
                            error: null,
                            status: 201
                        })
                    )
                    .catch(err =>
                        res.status(502).json({
                            method: "POST",
                            route: `/api/${req.params.endpoint}`,
                            data: null,
                            error: err,
                            status: 502
                        })
                    );
            }





        });

        // Read all MongoDB documents
        router.get("/:endpoint", (req, res) => {
            if (req.params.endpoint === 'books') {
                BookModel.find()
                    .then(documents =>
                        res.status(200).json({
                            method: "GET",
                            route: `/api/${req.params.endpoint}`,
                            data: documents,
                            error: null,
                            status: 200
                        })
                    )
                    .catch(err =>
                        res.status(502).json({
                            method: "GET",
                            route: `/api/${req.params.endpoint}`,
                            data: null,
                            error: err,
                            status: 502
                        })
                    );
            } else {
                res.status(502).json({
                    method: "GET",
                    route: `/api/${req.params.endpoint}`,
                    data: null,
                    error: "Route issue",
                    status: 502
                })
            }
        });

        // Read one MongoDB document
        router.get("/:endpoint/:id", (req, res) => {
            BookModel.findById(req.params.id)
                .then(document =>
                    res.status(200).json({
                        method: "GET",
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: document,
                        error: null,
                        status: 200
                    })
                )
                .catch(err =>
                    res.status(502).json({
                        method: "GET",
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: null,
                        error: err,
                        status: 502
                    })
                );
        });

        // Update MongoDB document
        router.put("/:endpoint/:id", (req, res) => {
            BookModel.findById(req.params.id)
                .then(document => {
                    // Update document
                    document.title = req.body.title;
                    document.content = req.body.content;

                    // Save document
                    document
                        .save()
                        .then(updatedDocument =>
                            res.status(200).json({
                                method: "PUT",
                                route: `/api/${req.params.endpoint}/${req.params.id}`,
                                data: updatedDocument,
                                error: null,
                                status: 200
                            })
                        )
                        .catch(err =>
                            res.status(502).json({
                                method: "PUT",
                                route: `/api/${req.params.endpoint}/${req.params.id}`,
                                data: null,
                                error: err,
                                status: 502
                            })
                        );
                })
                .catch(err =>
                    res.status(404).json({
                        method: "PUT",
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: null,
                        error: err,
                        status: 404
                    })
                );
        });
        // Delete MongoDB document
        router.delete("/:endpoint/:id", (req, res) => {
            BookModel.findOneAndDelete({
                    _id: req.params.id
                })
                .then(deletedDocument =>
                    res.status(200).json({
                        method: "DELETE",
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: deletedDocument,
                        error: null,
                        status: 200
                    })
                )
                .catch(err =>
                    res.status(404).json({
                        method: "DELETE",
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: null,
                        error: err,
                        status: 404
                    })
                );
        });
    }

    // Start router
    init() {
        // Get route fonctions
        this.routes();

        // Sendback router
        return router;
    }
}
//

/*
            Export
            */
module.exports = CrudRouterClass;
//