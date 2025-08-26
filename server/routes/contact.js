const express = require('express');
const { sendContact } = require('../controllers/contact');

const router = express.Router();

router.post('/', sendContact);

module.exports = router;
