# Backend Architecture Refactoring

## Overview
The backend has been restructured from a flat/semi-organized structure to a clean, layered architecture following Node.js best practices.

## New Directory Structure

```
backend/
├── src/
│   ├── server.js                 # Server entry point
│   ├── app.js                    # Express app factory
│   │
│   ├── config/                   # Configuration files
│   │   ├── environment.js        # Environment variables
│   │   ├── constants.js          # HTTP status & messages
│   │   ├── validation.js         # Validation rules
│   │   └── multer.js             # File upload configuration
│   │
│   ├── routes/                   # Route handlers
│   │   ├── index.js              # Main router
│   │   └── api/
│   │       ├── dataRoutes.js     # Data endpoints
│   │       ├── subscribeRoutes.js # Newsletter endpoints
│   │       └── userRoutes.js     # User endpoints
│   │
│   ├── controllers/              # Request handlers
│   │   ├── dataController.js
│   │   ├── subscribeController.js
│   │   └── userController.js
│   │
│   ├── services/                 # Business logic
│   │   ├── dataService.js
│   │   ├── subscribeService.js
│   │   └── userService.js
│   │
│   ├── middleware/               # Express middleware
│   │   ├── errorHandler.js       # Global error handling
│   │   ├── responseFormatter.js  # Response formatting
│   │   └── validators.js         # Validation middleware
│   │
│   ├── validators/               # Validation functions
│   │   ├── emailValidator.js
│   │   ├── userValidator.js
│   │   └── index.js
│   │
│   ├── database/                 # Data access layer
│   │   └── dataAccess.js         # JSON file operations
│   │
│   ├── utils/                    # Utility functions
│   │   ├── logger.js             # Logging utility
│   │   ├── fileHandler.js        # File operations
│   │   └── errors.js             # Custom error classes
│   │
│   ├── data/                     # Static data files
│   │   ├── partners.json
│   │   ├── projects.json
│   │   ├── services.json
│   │   ├── stats.json
│   │   └── stories.json
│   │
│   └── public/                   # Static files
│       └── uploads/              # User uploaded files
│
├── Dockerfile
├── package.json
└── .env                          # Environment variables
```

## Architecture Layers

### 1. **Entry Point** (`server.js`)
- Initializes the Express app
- Starts the server
- Handles graceful shutdown
- Handles uncaught exceptions

### 2. **App Factory** (`app.js`)
- Creates and configures Express app
- Sets up middleware
- Mounts routes
- Configures error handling

### 3. **Config** (`config/`)
- **environment.js**: Loads env variables from `.env`
- **constants.js**: HTTP status codes and messages
- **validation.js**: Validation patterns and rules
- **multer.js**: File upload configuration

### 4. **Routes** (`routes/`)
- **index.js**: Main router that mounts API routes
- **api/dataRoutes.js**: GET endpoints for projects, services, etc.
- **api/subscribeRoutes.js**: POST/DELETE newsletter endpoints
- **api/userRoutes.js**: User profile and upload endpoints

### 5. **Controllers** (`controllers/`)
- Handle HTTP requests/responses
- Use services for business logic
- Format responses consistently
- Handle errors via `next(error)`

### 6. **Services** (`services/`)
- Contain business logic
- Call data access layer
- Throw custom errors for controllers to handle
- Example: `dataService.getAll()`, `subscribeService.subscribe()`

### 7. **Middleware** (`middleware/`)
- **errorHandler.js**: Catches all errors and formats error responses
- **responseFormatter.js**: Ensures consistent response format
- **validators.js**: Input validation middleware

### 8. **Validators** (`validators/`)
- Pure validation functions
- Separated from middleware
- Reusable across services and middleware
- Throw `ValidationError` on invalid input

### 9. **Database Access** (`database/`)
- `dataAccess.js`: Singleton class for JSON file operations
- Methods: `loadData()`, `saveData()`, `findByProperty()`, `filterByProperty()`
- Handles all file I/O operations

### 10. **Utils** (`utils/`)
- **logger.js**: Logging with levels (ERROR, WARN, INFO, DEBUG)
- **fileHandler.js**: File operations (delete, ensure directory, stats)
- **errors.js**: Custom error classes (AppError, ValidationError, etc.)

## Key Improvements

### ✅ Separation of Concerns
- Controllers handle HTTP only
- Services contain business logic
- Validators are pure functions
- Database access is isolated

### ✅ Custom Error Handling
```javascript
class ValidationError extends AppError { }
class FileUploadError extends AppError { }
class NotFoundError extends AppError { }
```

### ✅ Consistent Error Response Format
All errors are caught by global error handler and formatted consistently.

### ✅ Better Code Reusability
- Validators can be used in services or middleware
- Services don't know about HTTP
- Easy to add new features without modifying existing code

### ✅ Scalability
- Easy to add new routes, controllers, services
- Clear structure for teams to follow
- Easy to add database/ORM layer in future

### ✅ Configuration Management
- All configuration in `config/` folder
- Single source of truth
- Easy to manage different environments

### ✅ Logging
- Centralized logging with levels
- Easy to debug issues
- Track errors with context

## Request Flow Example

```
GET /api/projects
  ↓
routes/api/dataRoutes.js
  ↓
controllers/dataController.js (getData)
  ↓
services/dataService.js (getAll)
  ↓
database/dataAccess.js (loadData)
  ↓
data/projects.json
  ↓
Response formatted and sent
```

## Migration from Old Structure

### Old Routes
```javascript
// Old: routes/index.js
router.get("/projects", getData("projects"));
router.post("/subscribe", validateSubscribeEmail, subscribe);
```

### New Routes
```javascript
// New: routes/api/dataRoutes.js
router.get("/projects", getData("projects"));

// New: routes/api/subscribeRoutes.js
router.post("/", validateSubscribeEmail, subscribe);

// New: routes/index.js
router.use("/data", dataRoutes);
router.use("/subscribe", subscribeRoutes);
```

## API Endpoints

All endpoints are prefixed with `/api` (from `config/environment.js`).

### Data Endpoints
- `GET /api/data/projects`
- `GET /api/data/services`
- `GET /api/data/stats`
- `GET /api/data/partners`
- `GET /api/data/stories`

### Subscribe Endpoints
- `POST /api/subscribe` - Subscribe to newsletter
- `POST /api/subscribe/unsubscribe` - Unsubscribe

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/upload` - Upload profile image

## Future Enhancements

1. **Database Integration**
   - Replace `dataAccess.js` with database ORM (MongoDB, PostgreSQL)
   - Update services to use async database queries
   - No changes needed in controllers/routes

2. **Authentication**
   - Add auth middleware
   - Use req.user context

3. **Validation Schemas**
   - Consider using Joi or Zod for complex validation
   - Keep validator functions or add new ones

4. **Testing**
   - Unit test services
   - Integration test routes
   - Mock dataAccess for unit tests

5. **Documentation**
   - Add OpenAPI/Swagger documentation
   - API docs auto-generated from comments

## Running the Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

## Environment Variables

Create `.env` file:
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*
LOG_LEVEL=INFO
```

## Notes

- All old files in root `backend/` folder still exist but are not used
- Can be safely deleted after confirming new structure works
- New structure follows industry best practices
- Easy to extend with new features
