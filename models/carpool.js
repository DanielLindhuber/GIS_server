const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carpoolSchema = new Schema({});

const ModelClass = mongoose.model("carpoolObject", carpoolSchema);

module.exports = ModelClass;
