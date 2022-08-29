const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 4,
    max: 15,
  },

  lastName: {
    type: String,
    required: true,
    min: 4,
    max: 15,
  },

  email: {
    type: String,
    required: true,
    min: 6,
    max: 15,
  },

  dateOfBirth: {
    type: Date,
    required: true,
  },

  mobile: {
    type: Number,
    required: true,
  },

  status: {
    type: Boolean,
    default: false,
  },

  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["student", "admin"],
    required: true,
  },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    else {
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);
