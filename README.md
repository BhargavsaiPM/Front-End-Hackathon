# Domestic Violence Support System

A comprehensive, gender-responsive web application for combating domestic violence. This system provides secure, anonymous support for victims/survivors, with dedicated portals for counsellors, legal advisors, and administrators.

## Features

### 🔒 Privacy & Security
- **Anonymous IDs**: All users receive auto-generated anonymous identifiers (e.g., `VIC-0001`)
- **Data Minimization**: Only essential information is collected and stored
- **Quick Exit Button**: Visible button to immediately leave the site
- **No Personal Identifiers**: Advisors never see real names, emails, addresses, or phone numbers
- **Role-Based Access Control**: Strict separation between user roles

### 👥 Four Distinct Portals

1. **Victim/Survivor Portal**
   - Anonymous registration with minimal required information
   - Access to resources (articles, helplines, legal info, health information)
   - Request counselling or legal support
   - Real-time chat with advisors
   - View advisor availability

2. **Counsellor Portal**
   - View anonymized help requests
   - Manage availability status
   - Chat with users
   - Track case progress

3. **Legal Advisor Portal**
   - View anonymized legal help requests
   - Manage availability status
   - Provide legal guidance via chat
   - Track case status

4. **Admin Portal**
   - View anonymized user statistics
   - Manage counsellors and legal advisors
   - Manage resources (articles, helplines, etc.)
   - View audit logs

### 🎨 User Experience
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Clean, Minimal UI**: Professional and non-intimidating interface
- **Gender-Inclusive**: Supports all genders with inclusive language
- **Accessibility**: Clear navigation and user-friendly forms

## Tech Stack

### Backend
- **Node.js** with Express
- **SQLite** database (local, file-based)
- **JWT** authentication
- **bcryptjs** for password hashing

### Frontend
- **React.js** (functional components + hooks)
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** with Flexbox/Grid and media queries

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Edit `.env` and set your JWT secret:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

5. Initialize the database:
```bash
npm run init-db
```

This will:
- Create the SQLite database
- Set up all tables
- Create default admin user: `admin@support.org` / `admin123`
- Create sample counsellor: `counsellor@support.org` / `counsellor123`
- Create sample legal advisor: `legal@support.org` / `legal123`
- Add sample resources

6. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## Default Login Credentials

After running `npm run init-db` in the backend, you can use these credentials:

- **Admin**: 
  - Email: `admin@support.org`
  - Password: `admin123`

- **Counsellor**: 
  - Email: `counsellor@support.org`
  - Password: `counsellor123`

- **Legal Advisor**: 
  - Email: `legal@support.org`
  - Password: `legal123`

## Project Structure

```
.
├── backend/
│   ├── database/
│   │   ├── db.js              # Database connection
│   │   └── schema.sql         # Database schema
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User routes
│   │   ├── helpRequests.js    # Help request routes
│   │   ├── messages.js        # Message/chat routes
│   │   ├── availability.js   # Availability routes
│   │   ├── resources.js       # Resource routes
│   │   └── admin.js           # Admin routes
│   ├── scripts/
│   │   └── initDatabase.js    # Database initialization script
│   ├── server.js              # Express server
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js      # Layout component
│   │   │   └── QuickExit.js   # Quick exit button
│   │   ├── context/
│   │   │   └── AuthContext.js # Authentication context
│   │   ├── pages/
│   │   │   ├── user/          # Victim/Survivor portal
│   │   │   ├── counsellor/    # Counsellor portal
│   │   │   ├── legal/         # Legal advisor portal
│   │   │   ├── admin/         # Admin portal
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── utils/
│   │   │   └── api.js         # API utility
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## Database Schema

The system uses SQLite with the following main tables:

- **users**: User accounts with anonymous IDs
- **help_requests**: Counselling and legal help requests
- **messages**: Chat messages between users and advisors
- **availability**: Advisor availability status
- **resources**: Articles, helplines, and information resources
- **audit_logs**: System activity logs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get own profile
- `GET /api/users/advisors` - Get advisor list
- `GET /api/users/anonymized` - Get anonymized user list (admin only)

### Help Requests
- `POST /api/help-requests` - Create help request (victim only)
- `GET /api/help-requests/my-requests` - Get own requests (victim)
- `GET /api/help-requests/counselling` - Get counselling requests (counsellor)
- `GET /api/help-requests/legal` - Get legal requests (legal advisor)
- `PATCH /api/help-requests/:id/assign` - Assign request to advisor
- `PATCH /api/help-requests/:id/status` - Update request status

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/help-request/:id` - Get messages for a request
- `POST /api/messages` - Send a message

### Availability
- `GET /api/availability` - Get advisor availability
- `PUT /api/availability/me` - Update own availability (advisor)

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create resource (admin)
- `PUT /api/resources/:id` - Update resource (admin)
- `DELETE /api/resources/:id` - Delete resource (admin)

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/advisors` - Get all advisors
- `POST /api/admin/advisors` - Create advisor
- `PUT /api/admin/advisors/:id` - Update advisor
- `DELETE /api/admin/advisors/:id` - Delete advisor
- `POST /api/admin/advisors/:id/reset-password` - Reset advisor password
- `GET /api/admin/audit-logs` - Get audit logs

## Security Considerations

1. **Anonymity**: Users are identified only by anonymous IDs. Personal information is never exposed to advisors.

2. **Data Protection**: 
   - Passwords are hashed using bcrypt
   - JWT tokens for authentication
   - No sensitive data in URLs

3. **Quick Exit**: 
   - Visible button on all pages
   - Immediately redirects to a neutral site (Google)

4. **Role-Based Access**: 
   - Each role has access only to their designated portal
   - API routes enforce role-based permissions

## Development Notes

- The database file (`support_system.db`) is created in `backend/database/`
- To reset the database, delete `support_system.db` and run `npm run init-db` again
- The frontend proxies API requests to `http://localhost:5000` (configured in `package.json`)
- For production, update the API URL in `frontend/src/utils/api.js`

## Contributing

This is a demonstration project. For production use, consider:
- Adding input validation and sanitization
- Implementing rate limiting
- Adding HTTPS
- Implementing proper logging
- Adding unit and integration tests
- Setting up CI/CD pipelines
- Adding monitoring and error tracking

## License

This project is provided as-is for educational and demonstration purposes.

## Support

For issues or questions, please refer to the project documentation or contact the development team.

---

**Important**: This system is designed for demonstration purposes. For production deployment, additional security measures, testing, and compliance with local regulations (especially regarding data protection and domestic violence support) must be implemented.

