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
const BookmarkSchema = new Schema({
    id: String,
    user_id: String,
    book_id: String,
    options: ['in_my_lib', 'favorite', 'have_read', 'reading', 'to_buy', 'to_sell']
});
//

/*
Export
*/
const Bookmark = mongoose.model('book', BookmarkSchema);
module.exports = Bookmark;
//