/**
 * Hand-written OpenAPI 3.0 spec.
 * Keep this in sync with backend/routes/index.js when new routes are added.
 * Served at GET /api/docs via swagger-ui-express.
 */
module.exports = {
  openapi: "3.0.3",
  info: {
    title: "Hamoda Charity API",
    version: "1.0.0",
    description: "REST API for the Hamoda Charity platform — projects, donations, help requests, volunteers, admin.",
  },
  servers: [
    { url: "/api", description: "Same-origin (default)" },
    { url: "http://localhost:5000/api", description: "Local dev server" },
  ],
  tags: [
    { name: "Public",       description: "Endpoints anyone can hit." },
    { name: "Donations",    description: "Donation creation, listing, and Stripe checkout." },
    { name: "Help Requests", description: "Help request submission + admin management." },
    { name: "Volunteers",   description: "Volunteer signups + admin moderation." },
    { name: "Admin",        description: "Admin-only endpoints (require Clerk admin role)." },
  ],
  components: {
    securitySchemes: {
      ClerkJwt:  { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      DevHeader: { type: "apiKey", in: "header", name: "x-user-id",
                   description: "Dev-only fallback when Clerk is not configured. Disabled in production." },
    },
    schemas: {
      Success: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "تم بنجاح" },
          data:    { description: "Endpoint-specific payload." },
        },
      },
      Error: {
        type: "object",
        properties: {
          success:    { type: "boolean", example: false },
          message:    { type: "string", example: "بيانات غير صحيحة" },
          statusCode: { type: "integer", example: 400 },
        },
      },
      Project: {
        type: "object",
        properties: {
          id:            { type: "string" },
          title:         { type: "string" },
          description:   { type: "string" },
          category:      { type: "string" },
          status:        { type: "string", enum: ["نشط", "مكتمل", "معلق"] },
          goal:          { type: "number" },
          raised:        { type: "number" },
          beneficiaries: { type: "number" },
          image:         { type: "string", nullable: true },
        },
      },
      Donation: {
        type: "object",
        properties: {
          id:           { type: "string" },
          donationType: { type: "string", enum: ["صدقة", "زكاة", "إغاثة", "إسكان", "علاج", "تعليم"] },
          amount:       { type: "number" },
          donorName:    { type: "string" },
          donorEmail:   { type: "string", format: "email" },
          donorPhone:   { type: "string" },
          paymentMethod:{ type: "string", enum: ["stripe", "paypal", "cash"] },
          projectId:    { type: "string", nullable: true },
          status:       { type: "string", enum: ["pending", "completed", "failed"] },
          createdAt:    { type: "string", format: "date-time" },
        },
      },
      HelpRequest: {
        type: "object",
        properties: {
          id:          { type: "string" },
          fullName:    { type: "string" },
          nationalId:  { type: "string", description: "9 digits" },
          phone:       { type: "string", description: "Must match /^05\\d{8}$/" },
          email:       { type: "string", format: "email", nullable: true },
          city:        { type: "string" },
          helpType:    { type: "string", enum: ["medical", "education", "food", "housing", "financial", "other"] },
          description: { type: "string", minLength: 20 },
          status:      { type: "string", enum: ["pending", "accepted", "rejected"] },
        },
      },
    },
  },
  paths: {
    "/projects": {
      get: { tags: ["Public"], summary: "List all projects", responses: { 200: { description: "OK", content: { "application/json": { schema: { allOf: [
        { $ref: "#/components/schemas/Success" },
        { properties: { data: { type: "array", items: { $ref: "#/components/schemas/Project" } } } } ] } } } } } },
      post: { tags: ["Admin"], summary: "Create project", security: [{ ClerkJwt: [] }, { DevHeader: [] }],
        responses: { 201: { description: "Created" }, 401: { description: "Unauthenticated" }, 403: { description: "Not admin" } } },
    },
    "/projects/{id}": {
      get:    { tags: ["Public"], summary: "Get project by id", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
               responses: { 200: { description: "OK" }, 404: { description: "Not found" } } },
      put:    { tags: ["Admin"], summary: "Update project", security: [{ ClerkJwt: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }] },
      delete: { tags: ["Admin"], summary: "Delete project", security: [{ ClerkJwt: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }] },
    },
    "/donations": {
      post: {
        tags: ["Donations"],
        summary: "Create a donation (may return a Stripe checkout URL)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["donationType", "amount", "donorName", "donorEmail", "donorPhone", "paymentMethod"],
                properties: {
                  donationType:  { type: "string", enum: ["صدقة", "زكاة", "إغاثة", "إسكان", "علاج", "تعليم"] },
                  amount:        { type: "number", minimum: 1 },
                  donorName:     { type: "string" },
                  donorEmail:    { type: "string", format: "email" },
                  donorPhone:    { type: "string" },
                  donorCity:     { type: "string" },
                  paymentMethod: { type: "string", enum: ["stripe", "paypal", "cash"] },
                  projectId:     { type: "string", nullable: true },
                  note:          { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Created — returns Donation or { donation, checkoutUrl } for Stripe" },
          400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      get: { tags: ["Admin"], summary: "List all donations", security: [{ ClerkJwt: [] }],
        parameters: [
          { name: "paginated", in: "query", schema: { type: "string", enum: ["1"] }, description: "Set to 1 for paginated envelope." },
          { name: "page",      in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize",  in: "query", schema: { type: "integer", default: 25, maximum: 200 } },
        ] },
    },
    "/donations/recent":   { get: { tags: ["Public"], summary: "Recent donations", parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 6, maximum: 50 } }] } },
    "/donations/stats":    { get: { tags: ["Public"], summary: "Donation aggregates" } },
    "/donations/{id}/receipt": { get: { tags: ["Donations"], summary: "Download a PDF receipt for a donation",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { 200: { description: "PDF stream", content: { "application/pdf": {} } }, 404: { description: "Not found" } } } },
    "/help-requests": {
      post: { tags: ["Help Requests"], summary: "Submit a help request (with optional document upload)",
        requestBody: { required: true, content: { "multipart/form-data": {} } },
        responses: { 201: { description: "Created" }, 400: { description: "Validation error" } } },
      get:  { tags: ["Admin"], summary: "List help requests", security: [{ ClerkJwt: [] }] },
    },
    "/volunteers": {
      post: { tags: ["Volunteers"], summary: "Submit a volunteer application",
        responses: { 201: { description: "Created" }, 400: { description: "Validation error" } } },
      get:  { tags: ["Admin"], summary: "List volunteer applications", security: [{ ClerkJwt: [] }] },
    },
    "/admin/stats": { get: { tags: ["Admin"], summary: "Aggregated dashboard stats", security: [{ ClerkJwt: [] }] } },
    "/uploads/image": { post: { tags: ["Admin"], summary: "Upload an image (multipart/form-data, field 'image')",
      security: [{ ClerkJwt: [] }],
      requestBody: { required: true, content: { "multipart/form-data": {} } },
      responses: { 200: { description: "OK — returns { url, filename }" } } } },
    "/subscribe": { post: { tags: ["Public"], summary: "Subscribe an email to the newsletter (rate-limited)" } },
  },
};
