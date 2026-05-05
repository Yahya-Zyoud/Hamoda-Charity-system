# Backend Architecture Refactoring
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