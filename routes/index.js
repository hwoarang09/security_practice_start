var express = require("express");
var path = require("path");
var router = express.Router();

const helmet = require("helmet");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const cookieSession = require("cookie-session");

router.get("/secret", (req, res) => {
  return res.send("Your Secret Value is 42HANMOOL!!");
});

/* GET home page. */

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "public", "index.html"));
});
module.exports = router;
