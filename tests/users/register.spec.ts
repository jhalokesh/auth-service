import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/register', () => {
    // happy path
    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            // Arrange - prepare data required for the test
            const userData = {
                firstname: 'Lokesh',
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
        });
    });

    // sad path
    describe('Fields are missing', () => {});
});
