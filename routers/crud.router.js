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


// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', verifyToken, userController.me)
router.get('/user/:id', userController.getOneUser )

//Book routes
router.get('/openlibrary/search', bookController.openResearchBooks);
router.get('/books/search', bookController.researchBooks);


/*
Exports
*/
module.exports = router;