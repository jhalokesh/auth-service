import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTables } from '../utils';

describe('POST /auth/register', () => {
    let connection: DataSource;

    // Global setup - run once before all test
    beforeAll(async () => {
        // connect DB
        connection = await AppDataSource.initialize();
    });

    //  Pre test setup - run before each test
    beforeEach(async () => {
        // truncate DB
        await truncateTables(connection);
    });

    // Global teardown - run once after all test
    afterAll(async () => {
        // close DB connection
        await connection.destroy();
    });

    // happy path
    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            // Arrange - prepare data required for the test
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'secret',
            };

            // Act - Trigger the main work
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert - Test expected output
            expect(response.statusCode).toBe(201);
        });

        it('should return valid JSON', async () => {
            // Arrange
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'secret',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json')
            );
        });

        it('should persist the user in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'secret',
            };

            // Act
            await request(app).post('/auth/register').send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        it('should return an id of the created user', async () => {
            // Arrange
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'secret',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            expect(response.body).toHaveProperty('id');
            const repository = connection.getRepository(User);
            const users = await repository.find();
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id
            );
        });
    });

    // sad path
    describe('Fields are missing', () => {});
});
