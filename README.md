# Status Page Application

A full-stack status page application where admins can manage service statuses and users can view real-time system status.

## Features

- **User Authentication** - Admin login system
- **Service Management** - CRUD operations for services
- **Status Updates** - Real-time status updates via WebSocket
- **Incident Management** - Create and manage incidents
- **Public Status Page** - Public view of system status
- **Real-time Updates** - Live status changes without refresh

## Tech Stack

- **Frontend**: React, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Database**: In-memory storage
- **Authentication**: JWT tokens

## Quick Start

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Public Status Page**: Visit `http://localhost:3000` to view the public status page
2. **User Login**: Go to `http://localhost:3000/login` and use:
   - **Admin**: `admin@example.com` / `password` (redirects to `/admin`)
   - **User**: `user@example.com` / `password` (redirects to `/dashboard`)
3. **Admin Dashboard**: Admin users can:
   - Add new services
   - Update service statuses
   - Create and manage incidents
4. **User Dashboard**: Normal users can:
   - View service statuses
   - See active incidents
   - Get real-time updates

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

### Services
- `GET /api/services/public` - Get public services
- `GET /api/services` - Get services (authenticated)
- `POST /api/services` - Create service (admin)
- `PATCH /api/services/:id/status` - Update service status (admin)

### Incidents
- `GET /api/incidents/public` - Get public incidents
- `POST /api/incidents` - Create incident (admin)
- `PATCH /api/incidents/:id/resolve` - Resolve incident (admin)

## Real-time Events

The application uses WebSocket for real-time updates:
- `statusUpdated` - Service status changes
- `incidentCreated` - New incidents
- `incidentUpdated` - Incident updates

## Default Data

The application comes with:
- Default admin user: `admin@example.com` / `Admin@2024!`
- Sample services: Website, API, Database
- All services initially set to "Operational"