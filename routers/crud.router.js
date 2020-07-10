/*
Imports
*/

//Node
const express = require("express");
const router = express.Router();

// Controllers
const userController = require('../controllers/user.controller');
const bookmarksController = require('../controllers/bookmarks.controller');

//Token
const auth = require('../middlewares/auth')


// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/user/:id', userController.getOneUser);
router.get('/profil', auth, userController.getInfoUser)


//Book routes
router.get('/openlibrary/search', bookmarksController.openResearchBooks);
router.post('/books/search', bookmarksController.researchBooks);
router.post('/book/:id', bookmarksController.showBook);

router.post('/bookmarks', bookmarksController.addBookmarks)
router.post('/profil/bookmarks', auth, bookmarksController.getBookmarksByUser)
router.delete('/profil/bookmark/:id', bookmarksController.deleteBookmarks)



/*
Exports
*/
module.exports = router;