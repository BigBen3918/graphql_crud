const express = require("express");
const router = express.Router();
const User = require("./User");

module.exports = (router) => {
    router.post("/add-user", User.add);
};
