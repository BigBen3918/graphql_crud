const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {
        type: String,
    },
    gender: {
        type: Number,
    },
    birthday: {
        type: Date,
    },
});

module.exports = User = mongoose.model("users", UserSchema);
