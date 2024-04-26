let path = require("path");
let express = require("express");
let router = express.Router();

router.get("/",function(req,res) {
    res.sendFile(path.resolve(__dirname,"index.html"));
});
router.get("/guesser", function(req,res) {
    res.sendFile(path.resolve(__dirname,"guesser.html"));
})
router.get("/main", function(req,res) {
    res.sendFile(path.resolve(__dirname,"lobbyStart.html"));
})

router.get("/create", function(req,res) {
    res.sendFile(path.resolve(__dirname,"dummy.html"));
})
router.get("/join", function(req,res) {
    res.sendFile(path.resolve(__dirname,"dummyJoin.html"));
})
router.get("/login", function(req,res) {
    res.sendFile(path.resolve(__dirname,"login.html"));
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;

///make a variable random num (/guesser + randomnum) in order to make protected hyperlinks
