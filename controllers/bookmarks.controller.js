const BookmarkModel = require("../models/bookmark.schema");

const openLibraryApiUrl = 'https://openlibrary.org';
const fetch = require('node-fetch');

exports.openResearchBooks = (req, res) => {
    fetch(openLibraryApiUrl + '/search.json?q=' + req.body.keywords)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            res.json(json);
        });
}

const googleBookApiUrl = 'https://www.googleapis.com/books/v1/volumes';
const apiKey = 'AIzaSyANVRaA6MlLTpQ1eUySanh0hx6O0zK8Tts';

exports.researchBooks = (req, res) => {
    fetch(googleBookApiUrl + '?q=' + req.body.keywords + '&key=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            res.json(json);
        });
}

exports.showBook = (req, res) => {
    fetch(googleBookApiUrl + '?q=' + req.body.isbn + '&key=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            res.json(json);
        });
}

exports.addBookmarks = (req, res) => {
    // Save user data
    const params = req.body;
    // Change user password with password hashed

    BookmarkModel.create(params)
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
}

exports.deleteBookmarks = (req, res) => {
    BookmarkModel.findByIdAndDelete(req.params.id)
        .then(document =>
            res.status(201).json({
                method: "DELETE",
                route: `/me/bookmark/${req.params.id}`,
                data: document,
                msg: 'Bookmark deleted !',
                error: null,
                status: 201
            })
        )
        .catch(err =>
            res.status(502).json({
                method: "DELETE",
                route: `/me/bookmarks/${req.params.id}`,
                data: null,
                error: err,
                status: 502
            })
        );
}


exports.getBookmarksByUser = (req, res) => {
    BookmarkModel.find({
        'user_id': req.body.userId
    }, function (err, bookmarks) {
        if (err) {
            return res.status(500).send({
                err: err
            })
        } else {
            res.status(200).json({
                data: bookmarks,
            })
        }
    });
}