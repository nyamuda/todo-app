# Vue 3 To-Do List App

A simple to-do list application built with Vue 3, Vuex for state management, and Bootstrap 5 for UI components. The app consumes an ASP.NET Core API and allows users to manage tasks with features like task addition, completion, filtering, and lazy loading.

---

## 🚀 Live Demo

- [Hosted App Link](https://prioritia.netlify.app)

---

## 🎯 Features

### 🛡️ Authentication & Authorization

- **User Registration & Email Verification:**  
   Users can register with their name, email, and password. Upon registration, a verification email is sent, and users need to verify their email before accessing the app.
- **JWT-Based Authentication:**  
   The app uses **JWT tokens** for secure authentication and authorization. Tokens are generated on login and included in all API requests to protect user data.
- **Google OAuth Integration:**  
   Users can also register and log in using their **Google account** securely.

### 📧 Forgot Password & Password Reset

- **Forgot Password:**  
   Users can request a password reset by entering their email. A secure **password reset link** is sent via email.
- **Password Reset:**  
   The password can be securely reset using the link provided.

### ✅ Task Management

- **Create, Update, and Delete Tasks:**  
   Users can create tasks with a **title, description, and due date**. Tasks can be edited, marked as completed, or deleted.
- **User-Specific Tasks:**  
   Each user can only view and manage **their own tasks** after logging in.
- **Dashboard Overview:**  
   After logging in, users are presented with a dashboard summarizing the **number of completed and uncompleted tasks**.

### 🎛️ Task Filtering & Pagination

- **Task Filtering:**  
   Users can filter tasks by:
  - All tasks
  - Completed tasks
  - Uncompleted tasks
- **Lazy Loading:**  
   Tasks are loaded **10 at a time**, with a **Load More** button for better performance on large datasets.

### 📦 Form Validation

- **Vuelidate Integration:**  
   Form validation is handled using **Vuelidate**, ensuring proper:
  - Required fields
  - Valid email formats
  - Minimum password length and format

---

## 📦 State Management (Vuex)

The app uses **Vuex** for centralized state management, handling:

- Fetching tasks and user data from the API
- Mutations for task creation, completion, and deletion
- Managing JWT tokens and authentication state

---

## 🛠️ Project Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Vue CLI (optional but recommended)

### Steps to Run the App

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/nyamuda/todo-app.git
   cd todo-app
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Development Server::**
   ```bash
   npm run serve
   ```

---

## ✅ API Endpoints (ASP.NET Core)

The app communicates with an **ASP.NET Core API** using the following endpoints:

- [Link To See Endpoints](https://quovoyapi.runasp.net/swagger/index.html)

---

## 📦 Technologies Used

- Vue.js 3
- Vuex
- Bootstrap 5

---

## 🚀 API Used

- [Repository Link](https://github.com/nyamuda/TodoAPI)
