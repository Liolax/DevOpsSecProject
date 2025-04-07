# Diary Notes Project

A modern, full-stack diary notes application that enables users to create, read, update, and delete diary entries (CRUD). This project is built with a React frontend and an Express/Node.js backend, with MongoDB as the database.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Application Architecture](#application-architecture)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
- [CI/CD Pipeline](#cicd-pipeline)
- [Container & Docker Compose Integration](#container--docker-compose-integration)
- [Security Considerations](#security-considerations)
- [Next Steps & Deliverables](#next-steps--deliverables)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This project is designed as a full-stack diary notes application with a clear separation between the frontend and backend:

- **Separation of Concerns:**  
  - The **backend** handles server-side logic, RESTful API endpoints, input validation, and database interactions. Entry point: `server.js`.
  - The **frontend** is built using React and provides an intuitive interface for users to manage their diary notes.
  
- **Testing & Version Control:**  
  - Comprehensive testing is in place for both frontend (using Jest/React Testing Library) and backend (using Mocha/Chai/Supertest).
  - Version control is managed with Git and GitHub, following modern collaboration and commit practices.

- **Documentation & CI/CD:**  
  - Essential project files include well-maintained `.gitignore` files and a detailed `README.md` (this document).
  - The CI/CD pipeline is automated with GitHub Actions to ensure code quality, run tests, and deploy updated Docker containers.

---

## Application Architecture

### Frontend

- **Purpose:**  
  Provides an intuitive, responsive interface that allows users to create, read, update, and delete diary notes effortlessly (CRUD).

- **Technology:**  
  Built using React.js as a Single Page Application (SPA).

- **Key Features:**  
  - Homepage displaying all existing notes.
  - Forms and buttons for CRUD (Create, Read, Update, Delete) operations.
  - Responsive design for both desktop and mobile users.

- **Containerization & Hosting:**  
  - The frontend is containerized with a Dockerfile that installs Node.js, builds the app using `npm run build`, and (optionally) uses an Nginx image to serve static files.
  - Deployed on free platforms like Netlify or Vercel.

### Backend

- **Purpose:**  
  Handles all CRUD operations, performs input validation, and manages database interactions.

- **Technology:**  
  Built using Node.js and Express.js with a RESTful API architecture.

- **Endpoints:**  
  - `GET /notes` – Fetch all notes.
  - `POST /notes` – Create a new note.
  - `PUT /notes/:id` – Update a specific note.
  - `DELETE /notes/:id` – Delete a specific note.

- **Containerization & Hosting:**  
  - The backend is containerized using a Dockerfile that installs dependencies, copies source files, and runs the app.
  - Hosted on free-tier platforms like Render or Railway.

### Database

- **Purpose:**  
  Store diary notes persistently for easy access and management.

- **Technology Options:**  
  - **Development:** Run MongoDB as a container using the official MongoDB image or use a lightweight embedded solution like SQLite.
  - **Production:** Use MongoDB Atlas Free Tier for scalable cloud-based storage.

- **Data Model:**  
  A single collection (or table) called `notes` with fields:
  - `id` – Unique identifier.
  - `title` – Note title.
  - `content` – Note content.
  - `created_at` – Timestamp of creation.
  - `updated_at` – Timestamp of last update.

---

## CI/CD Pipeline

### Pipeline Stages

- **Code Commit:**  
  - Version control via Git and GitHub ensures clear commit messages and collaboration history.
  
- **Build & Test:**  
  - GitHub Actions automates the build process and runs tests for both the frontend and backend.
  - **Frontend:** Uses Jest/React Testing Library for unit tests and ESLint for code style consistency.
  - **Backend:** Uses Mocha/Chai/Supertest for API testing and ESLint for backend code quality.
  
- **Deploy:**  
  - Automated Docker image builds for both frontend and backend.
  - Deployment to hosting platforms:
    - **Frontend:** Vercel or Netlify.
    - **Backend:** Render or Railway.
  - Sensitive information such as API keys and database credentials are managed using environment variables and GitHub Secrets.
  
- **Post-Deployment Validation:**  
  Ensure that even minor changes trigger a CI/CD build and result in a redeployment that updates the live sites.

### Security Measures in CI/CD

- **Environment Variables:**  
  Use GitHub Secrets to securely store credentials.

- **Ports & HTTPS:**  
  - **Backend:** Listens on PORT (default 5000) and uses HTTP internally while HTTPS is terminated via the hosting provider (e.g. Render).
  - **Frontend:** Typically served over ports 80/443 (HTTPS), with automatic SSL/TLS certificates provided by Vercel.
  
- **Middleware & Input Sanitization:**  
  - Use `helmet` to secure HTTP headers.
  - Use `express-validator` to validate incoming data and protect against malicious inputs.
  - CORS configuration allows only trusted origins.

---

## Container & Docker Compose Integration

### Dockerizing Each Component

- **Frontend Dockerfile:**  
  - Installs Node.js.
  - Builds the React app using `npm run build`.
  - Optionally uses an Nginx image to serve static files efficiently.
  
- **Backend Dockerfile:**  
  - Installs dependencies.
  - Copies source files.
  - Exposes the API port for communication.
  
- **Database Container:**  
  - Uses the official MongoDB image with persistent volumes for data storage.
  
### Docker Compose

A `docker-compose.yml` file can be used to define and manage all containers (frontend, backend, database) within a single network. This ensures consistent behavior across local development and production.

---

## Next Steps & Deliverables

### Short-Term Actions

- **Finalize Dockerfiles:**  
  For both the frontend and backend.

- **Configure Database:**  
  - Set up a free-tier MongoDB Atlas account for production.
  - Optionally, test locally using Docker Compose.

- **Repository & Collaboration:**  
  Create a GitHub repository and push regular commits with clear commit messages.

### CI/CD Setup

- **Automated Workflows:**  
  - Build Docker images.
  - Run tests and linting.
  - Deploy to chosen hosting environments.

- **Environment Setup:**  
  - Use GitHub Actions along with environment variable secrets to manage sensitive data securely.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed.
- [Docker](https://www.docker.com/get-started) for containerization.
- A MongoDB instance (e.g., MongoDB Atlas free tier or local Docker container).

### Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

   Open your terminal and run:

   ```bash
   git clone https://github.com/Liolax/DevOpsSecProject.git
   cd DevOpsSecProject
   ```

2. **Set Up the Backend**

   Navigate to the `backend` folder, install dependencies, configure environment variables, and start the server:

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` folder with your MongoDB connection string and desired port. For example:

   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

   Then, start the backend server:

   ```bash
   npm start
   ```

3. **Set Up the Frontend**

   Open a new terminal tab or window, navigate to the `frontend` folder, install dependencies, and start the React application:

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Run Tests**

   To verify everything works correctly, run the tests:

   - **Frontend Tests:**

     ```bash
     npm test -- --watchAll=false
     ```

   - **Backend Tests:**

     ```bash
     npm test
     ```

---

### Contributing

Contributions are welcome! To contribute:

- **Fork** the repository.
- Create a **new branch** for your feature or bug fix.
- Write clear and concise **commit messages**.
- Open a **pull request** detailing your changes.

---

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### Acknowledgments

- **Open Source Tools:**  
  Special thanks to the open-source community for providing tools like React, Express, MongoDB, and Docker.

- **CI/CD Inspiration:**  
  Inspired by best practices in CI/CD automation and containerization.

---
```