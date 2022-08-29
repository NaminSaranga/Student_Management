const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
app.use(cookieParser());

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected successfully");
});

const userRouter = require("./routes/User");
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
