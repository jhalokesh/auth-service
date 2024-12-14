import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';

import bcrypt from 'bcrypt';
import request from 'supertest';

import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import app from '../../src/app';
import { isJwt } from '../utils';

describe('POST /auth/login', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Successful Login', () => {
        it('should return a 200 status code with valid credentials', async () => {
            // Arrange
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'password',
            };

            // Hash user password before saving into DB
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                userData.password,
                saltRounds
            );
            // save user in DB
            const userRepository = connection.getRepository(User);
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send({ email: userData.email, password: userData.password });

            // Assert
            expect(response.statusCode).toBe(200);
        });

        it('should return a valid JSON structure', async () => {
            // Arrange
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'password',
            };

            // Hash user password before saving into DB
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                userData.password,
                saltRounds
            );
            // save user in DB
            const userRepository = connection.getRepository(User);
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send({ email: userData.email, password: userData.password });

            // Assert
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json')
            );
        });

        it('should return access and refresh tokens in cookies', async () => {
            // Arrange
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'password',
            };

            // Hash user password before saving into DB
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                userData.password,
                saltRounds
            );
            // save user in DB
            const userRepository = connection.getRepository(User);
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send({ email: userData.email, password: userData.password });

            interface Headers {
                ['set-cookie']: string[];
            }

            let accessToken: string | null = null;
            let refreshToken: string | null = null;

            const cookies =
                (response.header as unknown as Headers)['set-cookie'] || [];

            // Get Access Token and refresh tokens from the cookies array
            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken')) {
                    accessToken = cookie.split(';')[0].split('=')[1];
                }
                if (cookie.startsWith('refreshToken')) {
                    refreshToken = cookie.split(';')[0].split('=')[1];
                }
            });

            // Assert
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
    });

    describe('Invalid Credentials', () => {
        it('should return a 400 status code with incorrect email', async () => {
            // Arrange
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'password',
            };

            // Hash user password before saving into DB
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                userData.password,
                saltRounds
            );

            // Save user into DB
            const userRepository = connection.getRepository(User);
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            // Act
            const response = await request(app).post('/auth/login').send({
                email: 'wrong@mern.space',
                password: userData.password,
            });

            // Arrange
            expect(response.statusCode).toBe(400);
        });
        it('should return a 400 status code with incorrect password', async () => {
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'password',
            };

            // Hash user password before saving user into DB
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                userData.password,
                saltRounds
            );

            // Save user into DB
            const userRepository = connection.getRepository(User);
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            const response = await request(app)
                .post('/auth/login')
                .send({ email: userData.email, password: 'wrongPassword' });

            expect(response.statusCode).toBe(400);
        });

        it('should include an appropriate error message', async () => {
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'password',
            };

            // Hash user password before saving user into DB
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                userData.password,
                saltRounds
            );

            // Save user into DB
            const userRepository = connection.getRepository(User);
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            const response = await request(app)
                .post('/auth/login')
                .send({ email: userData.email, password: 'wrongPassword' });

            // Cast response.body to Error response
            interface ErrorDetail {
                type: string;
                message: string;
                path: string;
                location: string;
            }

            interface ErrorResponse {
                errors: ErrorDetail[];
            }

            const responseBody = response.body as ErrorResponse;

            expect(response.statusCode).toBe(400);

            expect(responseBody).toHaveProperty('errors');
            expect(responseBody.errors[0]).not.toBeNull();
        });
    });

    describe('Missing Fields', () => {
        it('should return a 400 status code if email is missing', async () => {
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'password',
            };

            // Hash user password before saving user into DB
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                userData.password,
                saltRounds
            );

            // Save user into DB
            const userRepository = connection.getRepository(User);
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            const response = await request(app)
                .post('/auth/login')
                .send({ email: '', password: userData.password });

            // Cast response.body to Error response
            interface ErrorDetail {
                type: string;
                message: string;
                path: string;
                location: string;
            }

            interface ErrorResponse {
                errors: ErrorDetail[];
            }

            const responseBody = response.body as ErrorResponse;

            expect(response.statusCode).toBe(400);
            expect(responseBody).toHaveProperty('errors');
            expect(responseBody.errors[0]).not.toBeNull();
        });
        it('should return a 400 status code if password is missing', async () => {
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'password',
            };

            // Hash user password before saving user into DB
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                userData.password,
                saltRounds
            );

            // Save user into DB
            const userRepository = connection.getRepository(User);
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            const response = await request(app)
                .post('/auth/login')
                .send({ email: '', password: userData.password });

            // Cast response.body to Error response
            interface ErrorDetail {
                type: string;
                message: string;
                path: string;
                location: string;
            }

            interface ErrorResponse {
                errors: ErrorDetail[];
            }

            const responseBody = response.body as ErrorResponse;

            expect(response.statusCode).toBe(400);
            expect(responseBody).toHaveProperty('errors');
            expect(responseBody.errors[0]).not.toBeNull();
        });
    });

    describe('Token Generation', () => {
        it.todo(
            'should generate a new refresh token and store it in the database'
        );
        it.todo('should set tokens in cookies with correct attributes');
    });
});
