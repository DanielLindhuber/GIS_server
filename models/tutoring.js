const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tutoringSchema = new Schema({});

const ModelClass = mongoose.model("tutoringObject", tutoringSchema);

module.exports = ModelClass;
