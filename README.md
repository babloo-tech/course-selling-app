# CourseHub - Course Selling App

### Project Description
**The CourseHub** is a course-selling platform built with the **MERN stack (MongoDB, Express, React, Node.js).** 
It provides a complete solution for creating, selling, and managing online courses. 
It also includes a security module with features for user authentication, admin control, payments, and more.

##  Live Demo
[https://course-selling-app-jade.vercel.app/](#) 

## Features
- **Frontend**: Built with React, providing a user-friendly interface.
- **Backend**: Powered by Node.js and Express, handling API requests, database interaction, and security.
- **Security**: Includes user and admin authentication, payment processing, and dashboard management.
- **Payment Integration**: Supports payments for course purchases.
- **Dashboard**: Admin dashboard for managing courses, users, and sales.

## Technologies Used
- **Frontend**:
    - React
    - React Router
    - Axios for API calls
    - Tailwind CSS for styling
    - React-Toastify for notifications
- **Backend**:
    - Node.js for business logic(scripting)
    - Express for middleware to create api
    - MongoDB for database
    - Mongoose for MongoDB ORM
    - JWT (JSON Web Token) for user authentication
    - zod for schema validation
    - Stripe for payment processing
- **Security**:
    - bcryptjs for password hashing
    - cors for cross-origin requests
    - cookie-parser for handling cookies

### Prerequisites
- Node.js (version 14 or above)
- MongoDB (locally or using a cloud provider like MongoDB Atlas)
- Stripe account (for payment processing)

### Installation
1. **Clone the repo**
   ```bash
      https://github.com/babloo-tech/course-selling-app.git
      cd course-selling-app
   
2. **Install backend dependencies**
     ```bash
        cd backend
        npm install

 
4. **Install frontend dependencies**
     ```bash
        cd frontend
        npm install

6. **Set up environment variables**
    - **Create .env files in both backend/ and frontend/ folders:**
      - Server .env
        ```bash
           PORT=3000
           MONGODB_URL=your_mongodb_connection

      - Client .env
        ```bash
           BACKEND_URL=http://localhost:5050
8. **Run the app**
 - **Backend**
 -   ```bash
        cd backend
        npm start
 - **Frontend**
      ```bash
         cd frontend
         npm run dev

  ### Running Locally
  1. - **Start both the backend and frontend servers (as outlined in the installation steps).**
  2. - **Access the frontend via http://localhost:3000 and the backend via http://localhost:5000**
 ### Deployment
  **You can deploy the backend and frontend separately:**
   - **Backend:** Use services like Render(this), Heroku or DigitalOcean
   - **Frontend:** Deploy using services like Vercel(this) or Netlify.

### Project Structures
/course-selling-app
```
    │
    ├── /backend                  # Backend (Express, Node.js)
    │   ├── /controllers           # Controllers for handling requests
    │   ├── /models                # Mongoose models (e.g., User, Course)
    │   ├── /routes                # Express route handlers
    │   ├── /middleware            # Middleware (e.g., authentication)
    │   ├── /config                # Configuration files (e.g., database, API keys)
    │   ├── index.js               # Main backend server file
    │   ├── .env                   # Environment variables (e.g., MongoDB URI, JWT secret)
    │   ├── package.json           # Backend dependencies and scripts
    │   └── .gitignore             # Files to ignore in Git
    │
    ├── /frontend                 # Frontend (React, Tailwind CSS)
    │   ├── /src
    │   │   ├── /components        # React components (e.g., CourseList, Home ,Courses)
    │   │   ├── /admin             # Admin related component
    │   │   ├── /assets            # Public assets
    │   │   ├── /utils             # Utility functions
    │   │   ├── App.js             # Main entry point of React app
    │   │   ├── main.js           # React app rendering
    │   ├── /public                # Public assets (e.g., images, icons)
    │   ├── .env                   # Frontend environment variables (e.g., backend API URL)
    │   ├── package.json           # Frontend dependencies and scripts
    │   ├── index.html              # Frontend-specific readme (if needed)
    │
    ├── README.md                  # Main project readme (for overall instructions)


