# Status Page Backend

Node.js/Express backend for the status page application.

## Structure

```
backend/
├── controllers/     # Request handlers
├── routes/         # API routes
├── services/       # Business logic
├── middleware/     # Authentication middleware
├── models/         # In-memory database
└── server.js       # Main server file
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - JWT signing secret (default: 'your-secret-key')

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Service Endpoints

#### GET /api/services/public
Get all services (public endpoint).

#### GET /api/services
Get all services (authenticated).

#### POST /api/services
Create a new service (admin only).

**Request:**
```json
{
  "name": "New Service"
}
```

#### PATCH /api/services/:id/status
Update service status (admin only).

**Request:**
```json
{
  "status": "operational" | "degraded-performance" | "partial-outage" | "major-outage"
}
```

### Incident Endpoints

#### GET /api/incidents/public
Get all incidents (public endpoint).

#### POST /api/incidents
Create a new incident (admin only).

**Request:**
```json
{
  "title": "Database Issues",
  "description": "Database experiencing high latency",
  "serviceIds": ["service_id_1", "service_id_2"]
}
```

## WebSocket Events

The server emits the following events:

- `statusUpdated` - When a service status changes
- `incidentCreated` - When a new incident is created
- `incidentUpdated` - When an incident is updated
- `serviceCreated` - When a new service is created