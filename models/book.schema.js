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
    user_id: String,
    options: ['in_my_lib', 'favorite', 'have_read', 'reading', 'to_buy', 'to_sell']
});
//

/*
Export
*/
const Book = mongoose.model('book', BookSchema);
module.exports = {Book : BookSchema};
//