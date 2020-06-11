const BookModel = require("../models/book.schema");

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

exports.researchBooks =  (req, res) => {
    fetch(googleBookApiUrl + '?q=' + req.body.keywords + '&key=' + apiKey)
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        res.json(json);
    });
}
