const express = require('express');
const { 
  register, 
  login, 
  getMe,
  logout
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Public routes
router.route('/register')
  .post(register);

router.route('/login')
  .post(login);

// Public logout (clears cookie)
router.route('/logout')
  .post(logout);

// Protected routes
router.use(protect);

router.route('/me')
  .get(getMe);

module.exports = router;
