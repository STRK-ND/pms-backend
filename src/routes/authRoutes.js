const express = require("express");
const router = express.Router();
const loginUser = require("../controllers/authControlle")


/*-----------------LOGIN FORM--------------- */
router.post("/login" ,loginUser )

module.exports = router