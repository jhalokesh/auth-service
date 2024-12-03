# Auth Service

## Overview

The **Auth Service** is a microservice for user authentication, developed with **Node.js**, **Express**, **TypeScript**, and **TypeORM**, using **PostgreSQL** as the database. It follows **Test-Driven Development (TDD)** principles and includes a well-tested user registration feature.

## Features

-   **User Registration**:

    -   **Endpoint**: `POST /auth/register`
    -   Validates the following required fields:
        -   `firstName`
        -   `lastName`
        -   `email`
        -   `password`
    -   Responds with:
        -   **201** status code for successful registrations.
        -   JSON-formatted responses.
    -   Ensures user data is persisted in the database.

-   **Testing**:

    -   Utilizes **Jest** and **Supertest** for:
        -   API endpoint testing.
        -   Status code verification.
        -   JSON response validation.
        -   Database integration testing.

-   **Database Integration**:
    -   Leverages **TypeORM** for object-relational mapping with PostgreSQL.
    -   Automatically synchronizes entities with the database in **development** and **test** environments.

## Getting Started

### Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/)
-   [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone the repository:

    ```bash
    # Using HTTPS
    git clone https://github.com/jhalokesh/auth-service.git

    # Using SSH
    git clone git@github.com:jhalokesh/auth-service.git

    cd auth-service
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure environment variables:

    - Create a `.env.development` file in the root directory.
    - Add the following variables:
        ```env
        PORT=3000
        NODE_ENV=development
        DB_HOST=localhost
        DB_PORT=5432
        DB_USERNAME=your_db_username
        DB_PASSWORD=your_db_password
        DB_NAME=your_db_name
        ```

4. Run the application:
    ```bash
    npm run dev
    ```

### Running Tests

To execute tests, run:

```bash
npm test
```

## Project Structure

The codebase is organized as follows:

```
src/
├── config/       # Configuration files (e.g., database, logger)
├── controllers/  # Express controllers for handling requests
├── entity/       # TypeORM entities
├── routes/       # API routes
├── services/     # Business logic and database interactions
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── tests/        # Test files for endpoints and business logic
```

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Make your changes.
4. Commit the changes:
    ```bash
    git commit -m "Add some feature"
    ```
5. Push the branch:
    ```bash
    git push origin feature/your-feature-name
    ```
6. Open a pull request.

## Contact

For questions or feedback, feel free to reach out:
**Email**: [jhalokesh.dev@gmail.com](mailto:jhalokesh.dev@gmail.com)
