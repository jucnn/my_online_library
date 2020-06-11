/*
Import
*/
const mongoose = require('mongoose');
const {
    Schema
} = mongoose;
//


/*
Definition
*/
const BookSchema = new Schema({
    id: String,
    title: String,
    authors: Array,
    publisher: String,
    publishedDate: Date,
    description: String,
    pageCount: Number,
    thumbnail: String,
    country: String,
    isbn: Number
});
//

/*
Export
*/
const Book = mongoose.model('book', BookSchema);
module.exports = {Book : BookSchema};
//