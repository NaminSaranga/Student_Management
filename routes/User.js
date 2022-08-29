const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Note = require("../models/Note");

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "Namin",
      sub: userID,
    },
    "Namin",
    { expiresIn: "1h" }
  );
};

userRouter.post("/register", (req, res) => {
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    mobile,
    status,
    password,
    accountType,
  } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err)
      res
        .status(500)
        .json({ message: { msgBody: "Error has occured", msgError: true } });
    if (user)
      res.status(400).json({
        message: { msgBody: "email is already taken", msgError: true },
      });
    else {
      const newUser = new User({
        firstName,
        lastName,
        email,
        dateOfBirth,
        mobile,
        status,
        password,
        accountType,
      });
      newUser.save((err) => {
        if (err)
          res.status(500).json({
            message: { msgBody: "Error has occured", msgError: true },
          });
        else
          res.status(201).json({
            message: {
              msgBody: "Account successfully created",
              msgError: false,
            },
          });
      });
    }
  });
});

userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const {
        _id,
        firstName,
        lastName,
        email,
        dateOfBirth,
        mobile,
        status,
        accountType,
      } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      res.status(200).json({
        isAuthenticated: true,
        user: {
          firstName,
          lastName,
          email,
          dateOfBirth,
          mobile,
          status,
          accountType,
        },
      });
    }
  }
);

userRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: { email: "", accountType: "" }, success: true });
  }
);

userRouter.post(
  "/note",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const note = new Note(req.body);
    note.save((err) => {
      if (err)
        res
          .status(500)
          .json({ message: { msgBody: "Error has occured", msgError: true } });
      else {
        req.user.notes.push(note);
        req.user.save((err) => {
          if (err)
            res.status(500).json({
              message: { msgBody: "Error has occured", msgError: true },
            });
          else
            res.status(200).json({
              message: {
                msgBody: "Successfully created notes",
                msgError: false,
              },
            });
        });
      }
    });
  }
);

userRouter.get(
  "/notes",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById({ _id: req.user._id })
      .populate("notes")
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: { msgBody: "Error has occured", msgError: true },
          });
        else {
          res.status(200).json({ notes: document.notes, authenticated: true });
        }
      });
  }
);

userRouter.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.accountType === "admin") {
      res
        .status(200)
        .json({ message: { msgBody: "You are an admin", msgError: false } });
    } else
      res.status(403).json({
        message: { msgBody: "You're not an admin", msgError: true },
      });
  }
);

userRouter.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { email, accountType } = req.user;
    res
      .status(200)
      .json({ isAuthenticated: true, user: { email, accountType } });
  }
);

module.exports = userRouter;
