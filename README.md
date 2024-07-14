# Blog API V2

Welcome to the Blog API V2! This project is an advanced version of the Blog API, designed to provide a comprehensive and efficient backend for managing blog posts, users, and comments. It is built using modern web technologies and follows best practices in API design.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization and Logout
- JWT-based authentication
- CRUD operations for blog posts
- CRUD operations for comments and Like
- Following (Friend Request) and Follower
- Public and Private Post
- Pagination and filtering of blog posts
- Notification
- **Chatting to user**
- User authentication with JSON Web Tokens
- Real-time chat with WebSockets
- Create new chat rooms for Private message and Group message
- Send and receive messages in real time
- View the list of all users
- View the history of previous messages
- send files in chatroom
- user online or offline or typing message other user can see.
- user profile management.

## Prerequisites

#### Backend
    - Python == 3.11.7
    - Django == 4.0
    - Redis server or you can use direct in-memory database in settings.py
### Frontend
    - node == 20.9.0
    - npm == 10.1.0
    - React

## Installation

 1. Clone the repository:

    ```sh
    git clone https://github.com/krishna2808/Blog-API--V2.git
    cd Blog-API--V2
    ```

  ### Frontend Installation
  
  2. Install the dependencies for both the frontend and backend:
  
      ```sh
      cd frontend && npm install
      npm start
      ```

  ### Backend Installation
  
  3. Install the dependencies for the backend:
  
      ```sh
      python3 -m venv venv 
      source venv/bin/activate #Linux (activated venv)
      cd backend 
      pip install -r requirements.txt
      python manage.py makemigrations 
      python manage.py migrate # note if it will not proper migration then makemigrations and migrate with manually app
      sudo apt-get install redis-server  # note if you don't want to use redis then in-memory database for development environment. 
      sudo systemctl restart redis-server 
      ```

## Running the Application

1. Start the backend server:

    ```sh
    cd backend
    python manage.py runserver
    ```

2. In a separate terminal, start the frontend application:

    ```sh
    cd frontend
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Technologies Used

- **Sqlite**:  Database for storing data
- **Django Rest Framework**: Drf framework for building REST APIs
- **React**: Library for building user interfaces
- **WebSockets channel**: Real-time communication between client and server
- **JWT**: Authentication using JSON Web Tokens
- **Redis server**: Redis server for Websocket.


## Screenshots


<!-- [![Watch the video](https://img.youtube.com/vi/RpXl9Rzfjp4/maxresdefault.jpg)](https://youtu.be/RpXl9Rzfjp4) -->

![Screencast from 2024-07-01](https://github.com/krishna2808/Templates/blob/main/image/Screencast%20from%202024-07-01%2021-23-45.gif)
<br>
<a href="https://youtu.be/RpXl9Rzfjp4" target="_blank">Watch Video</a>

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
