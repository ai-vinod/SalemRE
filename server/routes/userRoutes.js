const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserStats 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// All routes are protected and require admin access
router.use(protect, admin);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.get('/:id/stats', getUserStats);

module.exports = router;