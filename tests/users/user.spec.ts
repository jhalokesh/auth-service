import { DataSource } from 'typeorm';
import request from 'supertest';
import bcrypt from 'bcrypt';
import createJWKSMock from 'mock-jwks';

import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import { JwtPayload } from 'jsonwebtoken';

describe('GET /auth/self', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Given all fields', () => {
        it('should return 200 status code', async () => {
            const accessToken = jwks.token({
                sub: '1',
                role: Roles.CUSTOMER,
            });

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send();

            expect(response.statusCode).toBe(200);
        });

        it('should return the user data', async () => {
            // Register user
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'password',
                role: Roles.CUSTOMER,
            };

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                userData.password,
                saltRounds
            );

            const userRepository = connection.getRepository(User);
            const user = await userRepository.save({
                ...userData,
                password: hashedPassword,
            });

            // Generate Token
            const accessTokenPayload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = jwks.token(accessTokenPayload);

            // Add token to cookie
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send();

            // Assert
            // Check if user id matches with registered user
            expect((response.body as Record<string, string>).id).toBe(user.id);
        });

        it('should not return password field', async () => {
            // Register user
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'password',
                role: Roles.CUSTOMER,
            };

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                userData.password,
                saltRounds
            );

            const userRepository = connection.getRepository(User);
            const user = await userRepository.save({
                ...userData,
                password: hashedPassword,
            });

            // Generate Token
            const accessTokenPayload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = jwks.token(accessTokenPayload);

            // Add token to cookie
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send();

            // Assert
            // Check if user id matches with registered user
            expect(response.body as Record<string, string>).not.toHaveProperty(
                'password'
            );
        });
    });
});
