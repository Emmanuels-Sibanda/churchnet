# Church Venue & Equipment Hiring App

An online platform similar to Airbnb for churches to list, search, and book venues and equipment within their network.

## Features

- **Church Registration & Authentication**: Churches can register and manage their accounts
- **Venue Listings**: Churches can list their venues with details like capacity, pricing, amenities, and location
- **Equipment Listings**: Churches can list equipment (audio, video, lighting, staging, etc.) for rent
- **Search & Filter**: Search venues and equipment by location, capacity, price, and category
- **Booking System**: Request bookings for venues and equipment with date/time selection
- **Booking Management**: 
  - View your own bookings
  - Manage bookings for your listings (approve/reject)
- **Dashboard**: Manage your church's venues and equipment listings

## Tech Stack

### Backend
- Node.js with Express
- SQLite database
- JWT authentication
- RESTful API

### Frontend
- React
- React Router for navigation
- Axios for API calls
- Modern CSS with responsive design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies

From the root directory, run:

```bash
npm run install-all
```

This will install dependencies for:
- Root package (concurrently for running both servers)
- Server (backend)
- Client (frontend)

### Step 2: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set:
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

**⚠️ IMPORTANT:** 
- `JWT_SECRET` is **REQUIRED** and must be set to a strong random string
- Generate a secure secret using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- For production, set `CORS_ORIGIN` to your frontend domain (e.g., `https://yourdomain.com`)

### Step 3: Start the Application

From the root directory, run:

```bash
npm run dev
```

This will start both:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

Alternatively, you can run them separately:

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## Default Login Credentials

A default admin church is created automatically:
- **Email**: `admin@church.com`
- **Password**: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new church
- `POST /api/auth/login` - Login

### Venues
- `GET /api/venues` - Get all venues (with optional filters: city, state, minCapacity, maxPrice)
- `GET /api/venues/:id` - Get single venue
- `POST /api/venues` - Create venue (authenticated)
- `PUT /api/venues/:id` - Update venue (authenticated, own venue only)
- `DELETE /api/venues/:id` - Delete venue (authenticated, own venue only)

### Equipment
- `GET /api/equipment` - Get all equipment (with optional filters: category, maxPrice)
- `GET /api/equipment/:id` - Get single equipment
- `POST /api/equipment` - Create equipment (authenticated)
- `PUT /api/equipment/:id` - Update equipment (authenticated, own equipment only)
- `DELETE /api/equipment/:id` - Delete equipment (authenticated, own equipment only)

### Bookings
- `GET /api/bookings` - Get my bookings (authenticated)
- `GET /api/bookings/my-listings` - Get bookings for my listings (authenticated)
- `POST /api/bookings` - Create booking (authenticated)
- `PUT /api/bookings/:id/status` - Update booking status (authenticated, listing owner only)

### Churches
- `GET /api/churches` - Get all churches
- `GET /api/churches/:id` - Get single church

## Project Structure

```
multi-ti/
├── server/                 # Backend
│   ├── database/          # Database setup and configuration
│   ├── middleware/        # Authentication middleware
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── package.json
├── client/                # Frontend
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # React context (Auth)
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   ├── App.js        # Main app component
│   │   └── index.js      # React entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse**: Explore available venues and equipment
3. **Search**: Use filters to find specific venues or equipment
4. **List**: Add your church's venues and equipment in the Dashboard
5. **Book**: Request bookings for venues or equipment you need
6. **Manage**: Approve or reject booking requests for your listings

## Database

The application uses SQLite for simplicity. The database file (`venue_hiring.db`) is created automatically in `server/database/` on first run.

### Tables
- `churches` - Church/user accounts
- `venues` - Venue listings
- `equipment` - Equipment listings
- `bookings` - Booking requests and records

## Future Enhancements

- Image upload functionality
- Payment integration
- Email notifications
- Reviews and ratings
- Calendar view for bookings
- Advanced search with map integration
- Mobile app

## License

MIT
