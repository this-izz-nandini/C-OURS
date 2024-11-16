# Car Management Application

## Description
A **Car Management Application** that allows users to create, view, update, and delete car entries. Each car can have up to 10 images, a title, a description, and tags (e.g., car type, company, dealer). The app provides user authentication to ensure that users can only manage their own cars and includes search functionality to filter cars by title, description, or tags.

## Features
1. **User Authentication**:
   - Sign-up and login functionality using **Passport.js** for authentication.
   - Ensures users can only manage their own cars.

2. **Car Management**:
   - Add new cars with a maximum of 10 images, title, description, and tags.
   - View all cars created in a list format.
   - Search cars globally by title, description, or tags.
   - View detailed information about a specific car.
   - Update car details (title, description, tags, images).
   - Delete cars.
   - Add reviews about any car.

3. **Frontend**:
   - Built using **EJS templates**, **Bootstrap 5**, and custom **HTML/CSS**.
   - Pages:
     - **Sign Up / Login**: Allows user registration and login.
     - **Product List**: Displays all cars created by the logged-in user with a search bar.
     - **Product Creation**: Form to upload images, add a title, write a description, and set tags.
     - **Product Detail**: Displays the details of a car with options to edit or delete.

4. **Backend**:
   - Built with **Node.js**.
   - APIs for user and product management.
   - Input validation with **Joi** to ensure data integrity.

---

## Technology Stack

### Frontend:
- **EJS**: Templating engine for dynamic HTML rendering.
- **Bootstrap 5**: For responsive and aesthetic UI design.
- **HTML/CSS**: For structuring and styling web pages.

### Backend:
- **Node.js**: Backend runtime environment.
- **Express.js**: Web application framework for building APIs.
- **Passport.js**: For user authentication and session management.
- **Joi**: Schema description language for validating API inputs.

### Database:
- **MongoDB**: A NoSQL database to store user and car data. It provides high performance, flexibility, and scalability. 

### Cloud Services:
- **Cloudinary**: Used to manage image uploads for car products. Cloudinary provides a powerful API for storing, transforming, and delivering images efficiently.

---

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/this-izz-nandini/c-ours.git
   cd car-management-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     PORT=5000
     DB_URI=mongodb://localhost:27017/car-management
     SESSION_SECRET=your_secret_key
     CLOUDINARY_NAME=your_cloudinary_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

   > **Note**: To use Cloudinary:
   > - Sign up for a free account at [Cloudinary](https://cloudinary.com/).
   > - Retrieve your `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` from the **Cloudinary Dashboard**.

4. **Run the application**:
   ```bash
   npm start
   ```

5. **Access the application**:
   - Open your browser and go to `http://localhost:5000`.

---

## API Endpoints 
---

### **1. GET `/cars`**
Fetches a list of all cars.

- **Authentication**: Not required
- **Request Parameters**: None
- **Response**:
  - **Success (200)**: Renders `cars/index` with an array of car objects.
  - **Error**: Handled by `catchAsync` middleware.

---

### **2. GET `/cars/new`**
Renders a form to create a new car.

- **Authentication**: Required (`isLoggedIn` middleware)
- **Request Parameters**: None
- **Response**:
  - **Success (200)**: Renders `cars/new`.

---

### **3. POST `/cars`**
Creates a new car.

- **Authentication**: Required (`isLoggedIn` middleware)
- **Request Parameters**:
  - **Body**:
    ```json
    {
      "car": {
        "title": "string",
        "description": "string",
        "company": "string",
        "price": "number"
      }
    }
    ```
  - **Files**: Array of images (`upload.array('image')`)
- **Response**:
  - **Success (201)**: Redirects to `/cars/:id` with a success message.
  - **Error (400)**: Renders a validation error message (handled by `validateCar` middleware).

---

### **4. GET `/cars/search`**
Searches for cars based on a query tag.

- **Authentication**: Not required
- **Request Parameters**:
  - **Query**:
    ```json
    {
      "tag": "string"
    }
    ```
- **Response**:
  - **Success (200)**: Renders `cars/index` with search results.
  - **Error (400)**: Redirects to `/cars` with an error message if the query is empty or no results are found.

---

### **5. GET `/cars/:id`**
Fetches details for a specific car.

- **Authentication**: Not required
- **Request Parameters**:
  - **Path**:
    ```json
    {
      "id": "string (ObjectId)"
    }
    ```
- **Response**:
  - **Success (200)**: Renders `cars/show` with car details.
  - **Error (404)**: Redirects to `/cars` with an error message if the car is not found.

---

### **6. GET `/cars/:id/edit`**
Renders an edit form for a specific car.

- **Authentication**: Required (`isLoggedIn`, `isAuthor` middleware)
- **Request Parameters**:
  - **Path**:
    ```json
    {
      "id": "string (ObjectId)"
    }
    ```
- **Response**:
  - **Success (200)**: Renders `cars/edit` with car details.
  - **Error (404)**: Redirects to `/cars` with an error message if the car is not found.

---

### **7. PUT `/cars/:id`**
Updates a specific car.

- **Authentication**: Required (`isLoggedIn`, `isAuthor` middleware)
- **Request Parameters**:
  - **Path**:
    ```json
    {
      "id": "string (ObjectId)"
    }
    ```
  - **Body**:
    ```json
    {
      "car": {
        "title": "string",
        "description": "string",
        "company": "string",
        "price": "number"
      },
      "deleteImages": ["string"]
    }
    ```
  - **Files**: Array of images (`upload.array('image')`)
- **Response**:
  - **Success (200)**: Redirects to `/cars/:id` with a success message.
  - **Error (400)**: Validation or cloud storage errors.

---

### **8. DELETE `/cars/:id`**
Deletes a specific car.

- **Authentication**: Required (`isLoggedIn` middleware)
- **Request Parameters**:
  - **Path**:
    ```json
    {
      "id": "string (ObjectId)"
    }
    ```
- **Response**:
  - **Success (200)**: Redirects to `/cars` with a success message.

---

### Middleware Summary for Car Routes
1. **`isLoggedIn`**: Ensures the user is authenticated.
2. **`isAuthor`**: Ensures the logged-in user is the author of the car.
3. **`validateCar`**: Validates car input data (server-side validation).
4. **`catchAsync`**: Wraps async functions to catch and handle errors.

---

### **9. POST `/cars/:id/reviews`**
Creates a new review for a specific car.

- **Authentication**: Required (`isLoggedIn` middleware)
- **Request Parameters**:
  - **Path**:
    ```json
    {
      "id": "string (ObjectId)"
    }
    ```
  - **Body**:
    ```json
    {
      "review": {
        "rating": "number",
        "content": "string"
      }
    }
    ```
- **Response**:
  - **Success (201)**: Redirects to `/cars/:id` with a success message.
  - **Error (400)**: Validation or database errors (handled by `catchAsync`).

---

### **10. DELETE `/cars/:id/reviews/:reviewId`**
Deletes a specific review from a car.

- **Authentication**: Required (`isLoggedIn`, `isReviewAuthor` middleware)
- **Request Parameters**:
  - **Path**:
    ```json
    {
      "id": "string (ObjectId)",
      "reviewId": "string (ObjectId)"
    }
    ```
- **Response**:
  - **Success (200)**: Redirects to `/cars/:id` with a success message.
  - **Error (400/403)**: Validation or authorization errors (handled by `catchAsync`).

---

### Middleware Summary for Review Routes
1. **`validateReview`**: Validates review input data (e.g., checks for `rating` and `content`).
2. **`isLoggedIn`**: Ensures the user is authenticated.
3. **`isReviewAuthor`**: Ensures the logged-in user is the author of the review.

---

### **11. GET `/register`**
Renders the registration page.

- **Authentication**: Not required
- **Request Parameters**: None
- **Response**:
  - **Success (200)**: Renders `users/register`.

---

### **12. POST `/register`**
Registers a new user.

- **Authentication**: Not required
- **Request Parameters**:
  - **Body**:
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```
- **Response**:
  - **Success (201)**: Logs in the user, sets a success flash message, and redirects to `/cars`.
  - **Error (400)**: Displays a flash error message (e.g., validation or duplicate user errors) and redirects to `/register`.

---

### **13. GET `/login`**
Renders the login page.

- **Authentication**: Not required
- **Request Parameters**: None
- **Response**:
  - **Success (200)**: Renders `users/login`.

---

### **14. POST `/login`**
Logs in the user using credentials.

- **Authentication**: Not required
- **Request Parameters**:
  - **Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
- **Middleware**:
  - **`passport.authenticate('local')`**:
    - Checks user credentials using the local strategy.
    - Redirects to `/login` on failure, showing a flash message.
- **Response**:
  - **Success (200)**: Redirects to the `returnTo` URL (stored in session) or `/cars` by default. Sets a success flash message.
  - **Error (401)**: Redirects to `/login` with a failure flash message.

---

### **15. GET `/logout`**
Logs out the user.

- **Authentication**: Required
- **Request Parameters**: None
- **Response**:
  - **Success (200)**: Logs out the user, sets a success flash message, and redirects to `/cars`.
  - **Error (500)**: Handles logout errors (e.g., session-related issues).

---

---
## Flash Messages
1. **Success Flash Messages**:
   - After registration: "Welcome to C-OURS!"
   - After login: "Welcome back!"
   - After logout: "Logged out successfully!"
2. **Error Flash Messages**:
   - Registration errors (e.g., duplicate email, invalid data).
   - Login failure (e.g., incorrect username or password).
---

## Future Improvements
- Add role-based access control for advanced user permissions.
- Implement image optimization for faster loading.
- Enhance the search functionality with fuzzy matching.
- Add pagination for large car lists.
---
