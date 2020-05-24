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
const UserSchema = new Schema({
    name: {
        trim: true,
        required: true,
        type: String
    },
    email: {
        unique: true,
        trim: true,
        required: true,
        type: String,
    },
    password: {
        trim: true,
        required: true,
        type: String,
    }
});
// //
// // hash user password before saving into database
// UserSchema.pre('save', function (next) {
//     this.password = bcrypt.hashSync(this.password, saltRounds);
//     next();
// });
/*
Export
*/
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
//