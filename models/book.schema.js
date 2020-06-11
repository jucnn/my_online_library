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
const MySchema = new Schema({
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
const MyModel = mongoose.model('book', MySchema);
module.exports = MyModel;
//