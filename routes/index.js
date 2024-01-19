var express = require("express");
var router = express.Router();

router.get("/secret", (req, res) => {
  return res.send("Your Secret Value is 42HANMOOL!!");
});

/* GET home page. */

router.get("/", (req, res) => {
  console.log("hi");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
module.exports = router;
