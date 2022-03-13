const express = require('express');
const router = express.Router();

// controller
const Controller = require("../controllers/contactList");

// auto create contact list from uploads
router.post("/new/fromMemory", Controller.new_contact_from_memory)

module.exports = router;