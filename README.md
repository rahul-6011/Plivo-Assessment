# Status Page Application

A full-stack status page application where admins can manage service statuses and users can view real-time system status. Built with modern web technologies and real-time communication.

## Features

- **Multi-Organization Support** - Multiple organizations with separate data
- **User Authentication** - Role-based access (Admin, Manager, Member)
- **Service Management** - CRUD operations for services with status tracking
- **Real-time Updates** - Live status changes via WebSocket without page refresh
- **Incident Management** - Create, update, and resolve incidents with timeline
- **Public Status Page** - Clean, responsive public view of system status
- **Status History** - Track all status changes with timestamps
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router** - Client-side routing
- **Socket.io-client** - Real-time WebSocket communication
- **Axios** - HTTP client for API calls
- **CSS-in-JS** - Inline styling for component isolation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **Prisma** - Modern database toolkit and ORM
- **SQLite** - Lightweight database for development
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Database
- **SQLite** - File-based database (easily replaceable with PostgreSQL/MySQL)
- **Prisma Schema** - Type-safe database access

## Application Flow

### User Journey

1. **Public Access**: Anyone can view the status page at `/status/:org` (e.g., `/status/acme`)
2. **Admin Login**: Admins log in at `/login` with organization-specific credentials
3. **Service Management**: Admins can create, update, delete services and change their status
4. **Incident Management**: Admins can create incidents, add updates, and resolve them
5. **Real-time Updates**: All changes are instantly reflected on public pages via WebSocket

### Technical Flow

```
┌─────────────────┐    HTTP/WebSocket    ┌──────────────────┐    Prisma ORM    ┌──────────────┐
│   React Client  │ ◄──────────────────► │   Express Server │ ◄──────────────► │   SQLite DB  │
│                 │                      │                  │                  │              │
│ • Public Page   │                      │ • REST APIs      │                  │ • Users      │
│ • Admin Panel   │                      │ • WebSocket      │                  │ • Services   │
│ • Auth Context  │                      │ • JWT Auth       │                  │ • Incidents  │
│ • Socket Client │                      │ • CORS Enabled   │                  │ • History    │
└─────────────────┘                      └──────────────────┘                  └──────────────┘
```

### Real-time Communication

1. **Client Connection**: Frontend connects to WebSocket on page load
2. **Admin Action**: Admin changes service status in dashboard
3. **API Call**: Frontend sends HTTP request to backend
4. **Database Update**: Backend updates database via Prisma
5. **WebSocket Broadcast**: Backend emits event to all connected clients
6. **Live Update**: Public page receives event and updates UI instantly

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Backend Setup

```bash
cd backend
npm install

# Set up database
npx prisma generate
npx prisma db push
node prisma/seed.js

# Start development server
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

## Usage Guide

### For End Users (Public)

1. **View Status**: Visit `http://localhost:3000/status/acme` to see Acme Corp's status
2. **Check Services**: See all services and their current status (Operational, Degraded, etc.)
3. **View Incidents**: See any active incidents and their updates
4. **Real-time Updates**: Page updates automatically when admins make changes

### For Administrators

1. **Login**: Go to `http://localhost:3000/login`
2. **Use Credentials**:
   - **Acme Corp Admin**: `admin@acme.com` / `Admin@2024!`
   - **TechStart Admin**: `admin@techstart.com` / `Admin@2024!`
3. **Manage Services**:
   - Add new services with the "Add Service" form
   - Change service status using dropdown menus
   - Delete services with the delete button
4. **Handle Incidents**:
   - Create incidents affecting specific services
   - Add updates to keep users informed
   - Resolve incidents when issues are fixed
5. **Real-time Impact**: All changes instantly appear on public pages

### Testing Real-time Features

1. Open two browser tabs:
   - Tab 1: `http://localhost:3000/admin` (login as admin)
   - Tab 2: `http://localhost:3000/status/acme` (public page)
2. In admin tab: Change a service status or create an incident
3. In public tab: Watch changes appear instantly without refresh

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login with email/password
- `POST /api/auth/register` - Register new user (admin only)
- `GET /api/auth/me` - Get current authenticated user

### Service Management
- `GET /api/services/public?org=acme` - Get public services for organization
- `GET /api/services` - Get services (authenticated, org-filtered)
- `POST /api/services` - Create new service (admin only)
- `PUT /api/services/:id` - Update service details (admin only)
- `PATCH /api/services/:id/status` - Update service status (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)
- `GET /api/services/:id/history` - Get status change history

### Incident Management
- `GET /api/incidents/public?org=acme` - Get public incidents for organization
- `GET /api/incidents` - Get incidents (authenticated, org-filtered)
- `POST /api/incidents` - Create new incident (admin only)
- `PUT /api/incidents/:id` - Update incident (admin only)
- `POST /api/incidents/:id/updates` - Add incident update (admin only)
- `PATCH /api/incidents/:id/resolve` - Resolve incident (admin only)

## WebSocket Events

The application uses Socket.io for real-time bidirectional communication:

### Emitted by Server
- `statusUpdated` - When service status changes
  ```json
  { "serviceId": "123", "status": "degraded-performance", "service": {...} }
  ```
- `serviceCreated` - When new service is added
  ```json
  { "id": "456", "name": "New Service", "status": "operational" }
  ```
- `serviceDeleted` - When service is removed
  ```json
  { "serviceId": "123" }
  ```
- `incidentCreated` - When new incident is created
  ```json
  { "id": "789", "title": "API Issues", "status": "investigating" }
  ```
- `incidentUpdated` - When incident is updated or resolved
  ```json
  { "id": "789", "status": "resolved", "updates": [...] }
  ```

### Client Connection
- Clients automatically connect on page load
- Connection maintained for real-time updates
- Graceful reconnection on network issues

## Default Data & Organizations

The application comes pre-seeded with two organizations:

### Acme Corp (`/status/acme`)
- **Admin**: `admin@acme.com` / `Admin@2024!`
- **Manager**: `manager@acme.com` / `Admin@2024!`
- **Services**: Website, API, Database
- **Status**: Website & API (Operational), Database (Degraded Performance)

### TechStart Inc (`/status/techstart`)
- **Admin**: `admin@techstart.com` / `Admin@2024!`
- **Member**: `member@techstart.com` / `Admin@2024!`
- **Services**: Mobile App, Payment API, Analytics
- **Status**: All services initially Operational

## Architecture Highlights

### Security
- JWT-based authentication with secure token storage
- Role-based access control (Admin, Manager, Member)
- Password hashing with bcrypt
- CORS protection for API endpoints

### Performance
- Real-time updates eliminate need for polling
- Efficient database queries with Prisma
- Component-level state management
- Optimistic UI updates for better UX

### Scalability
- Multi-organization architecture
- Modular component structure
- RESTful API design
- Database schema supports horizontal scaling

### Developer Experience
- Type-safe database access with Prisma
- Hot reload in development
- Comprehensive error handling
- Clean separation of concerns

## Troubleshooting

### Common Issues

1. **Services not showing on public page**
   - Ensure you're visiting `/status/acme` not just `/`
   - Check browser console for API errors
   - Verify backend is running on port 5000

2. **Real-time updates not working**
   - Check WebSocket connection in browser dev tools
   - Ensure both frontend and backend are running
   - Try refreshing the page to reconnect

3. **Login issues**
   - Use exact credentials: `admin@acme.com` / `Admin@2024!`
   - Clear browser local storage if needed
   - Check network tab for authentication errors

4. **Database issues**
   - Run `npx prisma db push` to sync schema
   - Run `node prisma/seed.js` to reset data
   - Check if `dev.db` file exists in backend folder

### Development Tips

- Use browser dev tools to monitor WebSocket connections
- Check console logs for real-time event debugging
- Use `npx prisma studio` to view/edit database directly
- Monitor network tab to debug API calls