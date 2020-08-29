const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

router.post('/create', userController.createUser);
router.get('/list', userController.userList);
router.get('/login', userController.login);

module.exports = router;
