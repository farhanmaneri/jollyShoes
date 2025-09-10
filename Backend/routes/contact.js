const express = require("express");

const {getContact,addContact} = require("../controllers/contact");

const router = express.Router();

router.get("/", getContact);
router.post('/', addContact);

module.exports = router;