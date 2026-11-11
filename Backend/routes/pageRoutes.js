const express = require("express");
const router = express.Router();
const {
  getHome,
  getAbout,
  getContact,
} = require("../controllers/pageController");

// Public Routes (Har koi access kar sakta hai)
router.get("/home", getHome);
router.get("/about", getAbout);
router.get("/contact", getContact);

module.exports = router;