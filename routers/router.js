const express = require('express');
const routes = require('../routes');
const { home, register, login } = require('../controllers/controller.js');

const router = express.Router();

router.get(routes.home, home);
router.post(routes.register, register);
router.post(routes.login, login);

module.exports = router;
