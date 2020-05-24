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
    name: String,
    author: String,
    description: String
});
//

/*
Export
*/
const MyModel = mongoose.model('book', MySchema);
module.exports = MyModel;
//