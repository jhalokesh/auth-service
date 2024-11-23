import express from 'express';
import { AuthController } from '../controllers/AuthControllers';

const router = express.Router();

const authController = new AuthController();

router.post('/register', (req, res) => authController.register(req, res));

export default router;
