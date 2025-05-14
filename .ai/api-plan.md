# REST API Plan

## 1. Resources
- **Users** – Represents registered users. (Based on the Users table)
- **ShoppingLists** – Represents shopping list entities created by users. (Based on the ShoppingLists table)
- **Products** – Represents individual products attached to shopping lists. (Based on the Products table)
- **Statuses** – Represents status codes for shopping lists and products. (Based on the Statuses table)
- **Stores** – Represents stores associated with shopping lists. (Based on the Stores table)
- **Authentication** – Endpoints for user login and token management.

## 2. Endpoints

### Users
1. **User Registration**
   - **Method:** POST
   - **URL:** `/api/auth/register`
   - **Description:** Registers a new user with email, password, and household profile details.
   - **Request Body Example:**
     ```json
     {
       "email": "user@example.com",
       "password": "SecurePass123!",
       "userName": "JohnDoe",
       "householdSize": 3,
       "ages": [30, 28, 5],
       "dietaryPreferences": ["vegetarian", "gluten-free"]
     }
     ```
   - **Response Example:**
     ```json
     {
       "id": 1,
       "email": "user@example.com",
       "userName": "JohnDoe",
       "createdAt": "2025-04-10T12:00:00Z",
       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
     ```
   - **Success Codes:** 201 Created
   - **Error Codes:** 400 Bad Request, 409 Conflict (Email already exists)

2. **Get User Profile**
   - **Method:** GET
   - **URL:** `/api/users/profile`
   - **Description:** Retrieves authenticated user's profile details.
   - **Headers:** `Authorization: Bearer {token}`
   - **Response Example:**
     ```json
     {
       "id": 1,
       "email": "user@example.com",
       "userName": "JohnDoe",
       "householdSize": 3,
       "ages": [30, 28, 5],
       "dietaryPreferences": ["vegetarian", "gluten-free"],
       "createdAt": "2025-04-10T12:00:00Z",
       "listsCount": 5
     }
     ```
   - **Success Codes:** 200 OK
   - **Error Codes:** 401 Unauthorized

3. **Update User Profile**
   - **Method:** PUT
   - **URL:** `/api/users/profile`
   - **Description:** Updates authenticated user's profile details.
   - **Headers:** `Authorization: Bearer {token}`
   - **Request Body Example:**
     ```json
     {
       "userName": "JohnDoe",
       "householdSize": 4,
       "ages": [30, 28, 5, 2],
       "dietaryPreferences": ["vegetarian", "gluten-free", "dairy-free"]
     }
     ```
   - **Response Example:**
     ```json
     {
       "id": 1,
       "email": "user@example.com",
       "userName": "JohnDoe",
       "householdSize": 4,
       "ages": [30, 28, 5, 2],
       "dietaryPreferences": ["vegetarian", "gluten-free", "dairy-free"],
       "createdAt": "2025-04-10T12:00:00Z",
       "updatedAt": "2025-04-15T14:30:00Z",
       "listsCount": 5
     }
     ```
   - **Success Codes:** 200 OK
   - **Error Codes:** 400 Bad Request, 401 Unauthorized

### Authentication
1. **User Login**
   - **Method:** POST
   - **URL:** `/api/auth/login`
   - **Description:** Authenticates the user and returns an access token.
   - **Request Body Example:**
     ```json
     {
       "email": "user@example.com",
       "password": "SecurePass123!"
     }
     ```
   - **Response Example:**
     ```json
     {
       "userId": 1,
       "userName": "JohnDoe",
       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "expiresAt": "2025-04-10T13:00:00Z"
     }
     ```
   - **Success Codes:** 200 OK
   - **Error Codes:** 401 Unauthorized, 400 Bad Request

### ShoppingLists
1. **List All User Shopping Lists**
   - **Method:** GET
   - **URL:** `/api/shoppinglists`
   - **Description:** Retrieves all shopping lists for the authenticated user.
   - **Headers:** `Authorization: Bearer {token}`
   - **Query Parameters:** `page` (default=1), `pageSize` (default=10), `sort` (values: "newest", "oldest", "name")
   - **Response Example:**
     ```json
     {
       "data": [
         {
           "id": 1, 
           "title": "Weekly Groceries", 
           "productsCount": 12, 
           "plannedShoppingDate": "2025-04-15T09:00:00Z",
           "createdAt": "2025-04-10T12:00:00Z",
           "source": "manual",
           "storeName": "Lidl"
         },
         {
           "id": 2, 
           "title": "Weekend Party", 
           "productsCount": 5, 
           "plannedShoppingDate": null,
           "createdAt": "2025-04-11T09:30:00Z",
           "source": "ai_generated",
           "storeName": null
         }
       ],
       "pagination": {
         "page": 1,
         "pageSize": 10,
         "totalItems": 5,
         "totalPages": 1
       }
     }
     ```
   - **Success Codes:** 200 OK
   - **Error Codes:** 401 Unauthorized

2. **Get Single Shopping List**
   - **Method:** GET
   - **URL:** `/api/shoppinglists/{id}`
   - **Description:** Retrieves details of a specific shopping list, including all its products.
   - **Headers:** `Authorization: Bearer {token}`
   - **Response Example:**
     ```json
     {
       "id": 1,
       "title": "Weekly Groceries",
       "createdAt": "2025-04-10T12:00:00Z",
       "updatedAt": "2025-04-10T14:30:00Z",
       "plannedShoppingDate": "2025-04-15T09:00:00Z",
       "source": "manual",
       "storeId": 1,
       "storeName": "Lidl",
       "products": [
         {
           "id": 101,
           "name": "Milk",
           "quantity": 2,
           "statusId": 1,
           "status": "To buy",
           "createdAt": "2025-04-10T12:05:00Z"
         },
         {
           "id": 102,
           "name": "Bread",
           "quantity": 1,
           "statusId": 2,
           "status": "Bought",
           "createdAt": "2025-04-10T12:10:00Z"
         }
       ]
     }
     ```
   - **Success Codes:** 200 OK
   - **Error Codes:** 401 Unauthorized, 404 Not Found

3. **Create New Shopping List**
   - **Method:** POST
   - **URL:** `/api/shoppinglists`
   - **Description:** Creates a new shopping list with optional title and initial products.
   - **Headers:** `Authorization: Bearer {token}`
   - **Request Body Example:**
     ```json
     {
       "title": "My Custom List",
       "products": [
         { "name": "Apples", "quantity": 6 },
         { "name": "Bananas", "quantity": 3 }
       ],
       "storeId": 1,
       "plannedShoppingDate": "2025-04-20T10:00:00Z"
     }
     ```
   - **Response Example:**
     ```json
     {
       "id": 3,
       "title": "My Custom List",
       "createdAt": "2025-04-12T15:10:00Z",
       "source": "manual",
       "storeId": 1,
       "storeName": "Lidl",
       "plannedShoppingDate": "2025-04-20T10:00:00Z",
       "products": [
         {
           "id": 201,
           "name": "Apples",
           "quantity": 6,
           "statusId": 2,
           "status": "To buy"
         },
         {
           "id": 202,
           "name": "Bananas",
           "quantity": 3,
           "statusId": 2,
           "status": "To buy"
         }
       ]
     }
     ```
   - **Success Codes:** 201 Created
   - **Error Codes:** 400 Bad Request, 401 Unauthorized

4. **Edit Shopping List**
   - **Method:** PUT
   - **URL:** `/api/shoppinglists/{id}`
   - **Description:** Updates an existing shopping list, including its title, store name, planned date, and items. Removed items are deleted when omitted from the products array.
   - **Headers:** `Authorization: Bearer {token}`
   - **Request Body Example:**
     ```json
     {
       "title": "Updated List Title",
       "storeName": "Auchan",
       "plannedShoppingDate": "2025-04-25T11:00:00Z",
       "products": [
         { "id": 101, "name": "Milk", "quantity": 2 },
         { "id": 103, "name": "Eggs", "quantity": 12 }
       ]
     }
     ```
   - **Response Example:**
     ```json
     true
     ```
   - **Success Codes:** 200 OK
   - **Error Codes:** 400 Bad Request, 401 Unauthorized, 404 Not Found

5. **Delete Shopping List**
   - **Method:** DELETE
   - **URL:** `/api/shoppinglists/{id}`
   - **Description:** Permanently deletes a shopping list and all its associated products.
   - **Headers:** `Authorization: Bearer {token}`
   - **Success Codes:** 204 No Content
   - **Error Codes:** 401 Unauthorized, 404 Not Found

6. **Generate Shopping List using AI**
   - **Method:** POST
   - **URL:** `/api/shoppinglists/generate`
   - **Description:** Creates a new AI-generated shopping list based on user preferences and history.
   - **Headers:** `Authorization: Bearer {token}`
   - **Request Body Example:**
     ```json
     {
       "title": "Weekly Essentials",
       "plannedShoppingDate": "2025-04-20T10:00:00Z",
       "storeName": "Lidl"
     }
     ```
   - **Response Example:**
     ```json
     {
       "id": 4,
       "title": "Weekly Essentials",
       "createdAt": "2025-04-12T17:20:00Z",
       "updatedAt": "2025-04-12T17:20:00Z",
       "plannedShoppingDate": "2025-04-20T10:00:00Z",
       "source": "ai_generated",
       "storeId": null,
       "storeName": "lidl",
       "products": [
         { 
           "id": 301, 
           "name": "Milk", 
           "quantity": 2, 
           "statusId": 1, 
           "status": "To buy" 
         },
         { 
           "id": 302, 
           "name": "Bread", 
           "quantity": 1, 
           "statusId": 1, 
           "status": "To buy" 
         },
         { 
           "id": 303, 
           "name": "Eggs", 
           "quantity": 12, 
           "statusId": 1, 
           "status": "To buy" 
         }
       ]
     }
     ```
   - **Success Codes:** 201 Created
   - **Error Codes:** 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

## 3. Authentication and Authorization
- **Mechanism:** JSON Web Tokens (JWT) with bearer token authentication.
- **Implementation Details:**
  - Upon successful login via `/api/auth/login` or registration, an access token is issued.
  - Secure endpoints require the token in the `Authorization` header as `Bearer {token}`.
  - ASP.NET Core JWT middleware is used for authentication and authorization.
  - HTTPS is enforced to secure token transmission.
  - Token expiration is set to a reasonable period for security.
  - User identity is extracted from the token for authorization checks against resources.

## 4. Validation and Business Logic
- **Validation Rules:**
  1. **User Endpoints:** 
     - Email must be unique and in a valid format.
     - Password must meet complexity requirements.
     - Additional profile fields (e.g., household size, dietary preferences) are validated for presence and proper data types.
  2. **ShoppingLists:**
     - Title is optional but, if provided, should be a non-empty string.
     - Every shopping list must be associated with an existing user.
     - Store reference must be valid if provided.
     - PlannedShoppingDate must be a valid date format if provided.
  3. **Products:**
     - Product name must be provided and non-empty.
     - Quantity must be an integer greater than zero.
     - `statusId` must reference an existing status in the Statuses table.
- **Business Logic:**
  - **User Registration and Login:** Handled by dedicated endpoints ensuring that credentials are validated and securely stored.
  - **Cascade Deletion:** Deleting a shopping list automatically removes associated products, adhering to the database cascade rules.
  - **Pagination, Filtering, and Sorting:** Built into list endpoints to efficiently manage large data sets.
  - **Data Consistency:** Enforcement of database constraints (e.g., foreign key relationships) drives API validations.
  - **User-specific Data:** All shopping lists and related resources are scoped to the authenticated user.
  - **Error Handling:** Consistent error responses using ErrorOr pattern for predictable client-side handling.

This API plan is designed to be robust, secure, and aligned with the provided database schema, product requirements, and technology stack.
