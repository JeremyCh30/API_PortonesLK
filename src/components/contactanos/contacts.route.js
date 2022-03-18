const express = require('express');
const router = express.Router();
const contactApi = require('./contacts.api');

//create a contact
router.post('/contacts', (req, res) => {
    contactApi.registrarContacto(req, res);
})

module.exports = router;