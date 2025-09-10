const express = require("express");

const { addUpload} = require("../controllers/upload");

const router = express.Router();

router.post("/upload", addUpload);

module.exports = router;
