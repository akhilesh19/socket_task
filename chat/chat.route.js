const express = require('express');
const router = express.Router();
const chatController = require('./chat.controller');

router.post('/history', chatController.chatHistory);

module.exports = router;
