# Full Stack Note Web Application

A simple web application that allows users to take notes, tag them, and filter them. This project was developed as part of the Ensolvers Full Stack Implementation Exercise and is designed to be run using Docker Compose.

## Features Implemented

### Phase 1
* Create, Edit, and Delete notes.
* Archive and Unarchive notes.
* List active notes.
* List archived notes.

### Phase 2
* Add and remove tags (categories).
* Filter notes by tags.

## Primary Way to Run (Docker)

This application is best run using Docker and Docker Compose. A convenience script is provided to simplify this process.

**Example (using Docker Compose directly):**
```bash
docker-compose up --build -d
```

This command will build the Docker images for the frontend and backend services (if not already built or if changes are detected) and start them in detached mode. The backend Dockerfile handles database schema generation and migrations.

## Technologies Used
### General
* Containerization: Docker, Docker Compose
* Node.js Version (in Docker images): 20-alpine (specifically, Node.js v20.x LTS)
* npm (Node Package Manager): Version bundled with Node.js 20-alpine (e.g., 10.x.x)
### Backend (/backend folder)
* Runtime: Node.js 20-alpine (via Docker)
* Framework: Express.js ^5.1.0
* ORM: Prisma ^6.8.2 (CLI and @prisma/client)
* Database: SQLite (managed by Prisma, file within Docker volume)
* Language: JavaScript (ES6+)
* Key Packages:
* * cors: ^2.8.5
* * dotenv: ^16.5.0
* Development Utility:
* * nodemon: ^3.1.10 (for local non-Docker development)
### Frontend (/frontend folder)
* Framework: Next.js ^15
* UI Library: React.js ^19
* Language: TypeScript
* Styling: Tailwind CSS
* State Management: React Hooks (built-in)
* API Communication: Fetch API (browser built-in)
* Runtime (in Docker image): Node.js 20-alpine

## Prerequisites
### For Dockerized Deployment
* Docker Engine (e.g., Docker Desktop)
* Docker Compose
### For Local Development 
* Node.js 
* Git

## Setup and Running with Docker (Recommended)
Clone the repository:

```Bash
 git clone https://github.com/fawredd/fawredd-notes-app-monorepo.git
 cd fawredd-notes-app-monorepo
```

Ensure Docker is running.

Build and Start Services using Docker Compose:
From the root project directory (ensolvers-notes-app/):

```Bash
docker-compose up --build -d
```
## Accessing the Application:

* Frontend: Open your browser and go to http://localhost:3000
* Backend API: Accessible at http://localhost:5000/api/notes
The backend's database schema (npx prisma migrate deploy) and Prisma client generation (npx prisma generate) are handled within its Docker image build process.

### API Endpoints 
* GET /api/notes: Fetch all notes.
Query params: archived=true|false, tag=<tagName>
* POST /api/notes: Create a new note.
Body: { "title": "string", "content"?: "string", "tags"?: ["string"] }
* GET /api/notes/:id: Fetch a single note by its ID.
* PUT /api/notes/:id: Update an existing note.
Body: { "title"?: "string", "content"?: "string", "tags"?: ["string"], "archived"?: boolean }
* DELETE /api/notes/:id: Delete a note.

## Environment Variables
## Backend
* DATABASE_URL: Specifies the connection string for the Prisma database. Default for SQLite in Docker: file:./dev.db 
* PORT: The port the backend Express server listens on. Set to 5000 in docker-compose.yml and Dockerfile.
## Frontend 
* NEXT_PUBLIC_BACKEND_URL: The base URL for the backend API.
In Docker Compose (docker-compose.yml): Set to http://backend:5000 for service-to-service communication within the Docker network.
For local development outside Docker: The frontend API service will fallback (e.g. http://localhost:3001/api) or you can set this in frontend/.env.local.
NODE_ENV: Set to production in Docker builds.
