const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const app = express();

app.use(express.json());

router.get('/', userController.getUser);

router.get('/:id', userController.getUserById);

router.post('/', userController.createUser);

router.post('/login', userController.loginUser);

module.exports = router;