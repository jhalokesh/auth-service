import { Request } from 'express';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwkClient from 'jwks-rsa';
import { Config } from '../config';
import { AuthCookie } from '../types';

// return middleware - plug in route
export default expressjwt({
    secret: jwkClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI!,
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(req: Request) {
        // get token from headers - Bearer token
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
            const token = authHeader.split(' ')[1];
            if (token) {
                return token;
            }
        }

        // get token from cookies
        const { accessToken } = req.cookies as AuthCookie;

        return accessToken;
    },
});
