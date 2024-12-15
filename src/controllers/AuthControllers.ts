import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { JwtPayload } from 'jsonwebtoken';
import { Logger } from 'winston';
import { CredentialService } from '../services/CredentialService';
import { TokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';
import { AuthRequest, RegisterUserRequest } from '../types';

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction
    ) {
        // validations
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;

        // logger
        this.logger.debug('New request to register a user', {
            firstName,
            lastName,
            email,
            password: '*********',
        });

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });

            this.logger.info('User has been registered', { id: user.id });

            const accessTokenPayload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const refreshTokenPayload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken =
                this.tokenService.generateAccessToken(accessTokenPayload);

            // Persit then refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...refreshTokenPayload,
                id: String(newRefreshToken.id),
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1 hour
                httpOnly: true,
            });

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year
                httpOnly: true,
            });

            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }

    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        // validations
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, password } = req.body;

        // logger
        this.logger.debug('New request to login a user', {
            email,
            password: '*********',
        });

        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                const error = createHttpError(
                    400,
                    'email or password does not match'
                );
                next(error);
                return;
            }

            const passwordMatched =
                await this.credentialService.comparePassword(
                    password,
                    user.password
                );

            if (!passwordMatched) {
                const error = createHttpError(
                    400,
                    'email or password does not match'
                );
                next(error);
                return;
            }

            const accessTokenPayload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const refreshTokenPayload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken =
                this.tokenService.generateAccessToken(accessTokenPayload);

            // Persit then refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...refreshTokenPayload,
                id: String(newRefreshToken.id),
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1 hour
                httpOnly: true,
            });

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year
                httpOnly: true,
            });

            res.status(200).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }

    async self(req: AuthRequest, res: Response) {
        const user = await this.userService.findById(Number(req.auth.sub));

        // token req.auth.id
        res.json({ ...user, password: undefined });
    }
}
