import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';

import bcrypt from 'bcrypt';
import request from 'supertest';

import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import app from '../../src/app';

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

        it.todo('should return access and refresh tokens in cookies');
    });

    describe('Invalid Credentials', () => {
        it.todo('should return a 400 status code with incorrect email');
        it.todo('should return a 400 status code with incorrect password');
        it.todo('should include an appropriate error message');
    });

    describe('Missing Fields', () => {
        it.todo('should return a 400 status code if email is missing');
        it.todo('should return a 400 status code if password is missing');
        it.todo('should include error messages for missing fields');
    });

    describe('Email Format Validation', () => {
        it.todo('should return a 400 status code for invalid email format');
        it.todo('should include a descriptive error message');
    });

    describe('Token Generation', () => {
        it.todo(
            'should generate a new refresh token and store it in the database'
        );
        it.todo('should set tokens in cookies with correct attributes');
    });
});
