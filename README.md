# Blog API V2

Welcome to the Blog API V2! This project is an advanced version of the Blog API, designed to provide a comprehensive and efficient backend for managing blog posts, users, and comments. It is built using modern web technologies and follows best practices in API design.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- CRUD operations for blog posts
- CRUD operations for comments
- Pagination and filtering of blog posts
- JWT-based authentication
- Secure password hashing

## Installation

To install and run this project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/krishna2808/Blog-API--V2.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Blog-API--V2
    ```

3. Install the dependencies:

    ```bash
    python3.10
    pip install -r requirements.txt
    ```

4. Set up the environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```env
    DATABASE_URL=your_database_url
    JWT_SECRET=your_jwt_secret
    ```

5. Run the database migrations:

    ```bash
    npx sequelize-cli db:migrate
    ```

6. Start the server:

    ```bash
    npm start
    ```

The server should now be running on `http://localhost:3000`.

## Usage

To use the API, you can send HTTP requests to the endpoints described below. You can use tools like Postman or cURL to interact with the API.

## Endpoints

Here are some of the main endpoints available in this API:

### Authentication

- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`

### Users

- **Get all users**: `GET /api/users`
- **Get user by ID**: `GET /api/users/:id`
- **Update user**: `PUT /api/users/:id`
- **Delete user**: `DELETE /api/users/:id`

### Posts

- **Get all posts**: `GET /api/posts`
- **Get post by ID**: `GET /api/posts/:id`
- **Create new post**: `POST /api/posts`
- **Update post**: `PUT /api/posts/:id`
- **Delete post**: `DELETE /api/posts/:id`

### Comments

- **Get all comments**: `GET /api/comments`
- **Get comment by ID**: `GET /api/comments/:id`
- **Create new comment**: `POST /api/comments`
- **Update comment**: `PUT /api/comments/:id`
- **Delete comment**: `DELETE /api/comments/:id`

## Technologies Used

- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL (Database)
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Contributing

We welcome contributions to this project! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
