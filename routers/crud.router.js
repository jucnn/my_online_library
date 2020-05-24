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
                    // Change user password
                    params.password = hash;

                    UserModel.create(params)
                        .then(document =>
                            res.status(201).json({
                                method: "POST",
                                route: `/api/mongo/register`,
                                data: document,
                                error: null,
                                status: 201
                            })
                        )
                        .catch(err =>
                            res.status(502).json({
                                method: "POST",
                                route: `/api/mongo/register`,
                                data: null,
                                error: err,
                                status: 502
                            })
                        );
                })
                .catch(hashError =>
                    res.status(500).json({
                        method: "POST",
                        route: `/api/mongo/auth/register`,
                        data: null,
                        error: hashError,
                        status: 500
                    })
                );
        });
        //

        // Login
        router.post("/login", (req, res) => {
            let getUser;
            UserModel.findOne({
                email: req.body.email
            }).then(user => {
                if (!user) {
                    return res.status(401).json({
                        message: "Authentication failed"
                    });
                }
                getUser = user;
                return bcrypt.compare(req.body.password, user.password);
            }).then(response => {
                if (!response) {
                    return res.status(401).json({
                        message: "Authentication failed"
                    });
                }
                let jwtToken = jwt.sign({
                    email: getUser.email,
                    userId: getUser._id
                }, "longer-secret-is-better", {
                    expiresIn: "1h"
                });
                res.status(200).json({
                    token: jwtToken,
                    expiresIn: 3600,
                    msg: getUser
                });
            }).catch(err => {
                return res.status(401).json({
                    message: "Authentication failed"
                });
            });
        });


        // Login
        // router.post("/login", (req, res) => {

        //     UserModel.findOne(
        //     {
        //       email: req.body.email
        //     },
        //     (err, user) => {
        //       if (err) {
        //         return res.status(500).json({
        //           method: "POST",
        //           route: `/api/mongo/login`,
        //           data: null,
        //           error: err,
        //           status: 500
        //         });
        //       } else {
        //         // Check user password
        //         if (!bcrypt.compareSync(req.body.password, user.password)) {
        //           return res.status(500).json({
        //             method: "POST",
        //             route: `/api/mongo/login`,
        //             data: null,
        //             error: "Invalid password",
        //             status: 500
        //           });
        //         } else {
        //           return res.status(201).json({
        //             method: "POST",
        //             route: `/api/mongo/login`,
        //             data: user,
        //             error: null,
        //             status: 201
        //           });
        //         }
        //       }
        //     });
        // });
        // //

        // Create one item
        router.post("/:endpoint", (req, res) => {
            BookModel.create(req.body)
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
        });

        // Read all MongoDB documents
        router.get("/:endpoint", (req, res) => {
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