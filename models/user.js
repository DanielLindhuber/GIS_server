const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
const tutoringObject = require("./tutoring");
const carpoolObject = require("./carpool");

const userSchema = new Schema({
  username: { type: String, unique: true, lowercase: true },
  name: { type: String, unique: true },
  password: String,
  adress: String,
  email: { type: String, unique: false }, // needs to be changed to true
  coordinates: { lat: Number, lng: Number },
  carpool: [carpoolObject],
  tutoring: [tutoringObject]
});

// -------------------------------------------------------------------------
userSchema.pre("save", function(next) {
  const user = this;
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// -------------------------------------------------------------------------

const ModelClass = mongoose.model("user", userSchema);

module.exports = ModelClass;