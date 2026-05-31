import express from 'express';
import { registerUser, loginUser, makeAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/makeadmin/:email', makeAdmin);

// Example protected route to fetch logged-in user profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

export default router;
