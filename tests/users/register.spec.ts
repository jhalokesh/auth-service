import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { Roles } from '../../src/constants';

describe('POST /auth/register', () => {
    let connection: DataSource;

    // Global setup - run once before all test
    beforeAll(async () => {
        // connect DB
        connection = await AppDataSource.initialize();
    });

    //  Pre test setup - run before each test
    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
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

        it('should assign a customer role', async () => {
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
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.find();

            expect(user[0]).toHaveProperty('role');
            expect(user[0].role).toBe(Roles.CUSTOMER);
        });

        it('should store the hashed password in the database', async () => {
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
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.find();

            expect(user[0].password).not.toBe(userData.password);
            expect(user[0].password).toHaveLength(60);
            expect(user[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it('should return a 400 status code if email already exists', async () => {
            // Arrange
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'secret',
            };

            // Saving a user
            const userRepository = AppDataSource.getRepository(User);
            await userRepository.save({
                ...userData,
                role: 'customer',
            });

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            const users = await userRepository.find();

            // Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });
    });

    // sad path
    describe('Fields are missing', () => {
        it('should return 400 status code if email field is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Lokesh',
                lastName: 'Jha',
                email: '',
                password: 'secret',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            const userRepository = AppDataSource.getRepository(User);
            const users = await userRepository.find();

            // Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });
    });
});
