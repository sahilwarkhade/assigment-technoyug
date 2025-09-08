# TechnoYug Backend Intern Assignment

This is a backend application for user management built with Node.js, Express, and MongoDB. It features JWT-based authentication, password hashing, protected routes, and role-based access control, email verification using nodemailer npm package.

## ✨ Features

-   **User Management**: Sign Up, Login, Logout.
-   **Security**:
    -   Password hashing with `bcryptjs`.
    -   JWT Authentication with Access (15 min) and Refresh Tokens (7 days).
-   **Protected Routes**: `/api/v1/users/profile` accessible only with a valid access token.
-   **Error Handling**: Centralized error handling for clean responses.
-   **(Bonus) Role-Based Access Control**: `user` and `admin` roles.
-   **(Bonus) Rate Limiting**: Protects the login route from brute-force attacks.
-   **(Bonus) Dockerized**: Ready to run with Docker and Docker Compose.

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose
-   **Authentication**: JSON Web Tokens (JWT)
-   **Password Hashing**: bcryptjs
-   **Validation**: express-validator
-   **Containerization**: Docker
-   **Sending Mail**: Nodemailer

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm
-   MongoDB (either local or a cloud instance like MongoDB Atlas)
-   (Optional) Docker and Docker Compose

### 1. Clone the repository

```bash

git clone https://github.com/sahilwarkhade/assigment-technoyug.git
cd assigment-technoyug

```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following variables. Use the `.env.example` file as a template.

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/technoyugDB
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 4. Run the application

**For development (with hot-reloading):**

```bash
npm run dev
```

**For production:**

```bash
npm start
```

### 5. Running with Docker (Optional)

1.  Ensure Docker is running on your machine.
2.  Run the following command from the root directory:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:5000`.

## ⚙️ API Endpoints

The base URL is `http://localhost:5000`.

### Authentication

| Method | Endpoint                   | Description                                        | Access  |
| :----- | :------------------------- | :------------------------------------------------- | :------ |
| `POST` | `/api/v1/auth/signup`      | Register a new user.                               | Public  |
| `POST` | `/api/v1/auth/login`       | Log in a user and get access/refresh tokens.       | Public  |
| `POST` | `/api/v1/auth/refresh`     | Get a new access token using a valid refresh token.| Public  |
| `POST` | `/api/v1/auth/logout`      | Log out the user by invalidating the refresh token.| Public  |

### Users

| Method | Endpoint                | Description                                          | Access  |
| :----- | :---------------------- | :--------------------------------------------------- | :------ |
| `GET`  | `/api/v1/users/profile` | Get the profile of the currently logged-in user.     | Private |

**Note on Private Routes**: To access private routes, you must include an `Authorization` header with the value `Bearer <your_access_token>`.

#### Example Request Body for Signup:
```json
{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
}
```

#### Example Request Body for Login:
```json
{
    "email": "john.doe@example.com",
    "password": "password123"
}
```

#### Verifying email using Nodemailer
-Once you create your account the verification mail will send to your provided email address, by clicking verify email, you are able to verify email. 

-If you don't verify your email you are will not able to login in your account.

-For sending email i am using nodemailer npm package