/*
Imports
*/

//Node
const express = require("express");
const router = express.Router();

// Controllers
const userController = require('../controllers/user.controller');
const bookController = require('../controllers/book.controller');

//Token
const verifyToken = require('../services/verifyToken')

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', verifyToken, userController.me)
router.get('/user/:id', userController.getOneUser )

/*
Exports
*/
module.exports = router;