import express, { NextFunction, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthControllers';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import registerValidator from '../validators/register-validator';
import { TokenService } from '../services/TokenService';
import { RefreshToken } from '../entity/RefreshToken';
import loginValidator from '../validators/login-validator';
import { CredentialService } from '../services/CredentialService';
import authenticate from '../middlewares/authenticate';
import { AuthRequest } from '../types';
import validateRefreshToken from '../middlewares/validateRefreshToken';
import parseRefreshToken from '../middlewares/parseRefreshToken';

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

const userService = new UserService(userRepository);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();

const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService
);

router.post(
    '/register',
    registerValidator,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await authController.register(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/login',
    loginValidator,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await authController.login(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/self',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await authController.self(req as AuthRequest, res);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/refresh',
    validateRefreshToken,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await authController.refresh(req as AuthRequest, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/logout',
    authenticate,
    parseRefreshToken,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await authController.logout(req as AuthRequest, res, next);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
