# Vue 3 To-Do List App

A simple to-do list application built with Vue 3, Vuex for state management, and Bootstrap 5 for UI components. The app consumes an ASP.NET Core API and allows users to manage tasks with features like task addition, completion, filtering, and lazy loading.

## 🎯 Features
## 🎯 New Features

- **User Registration & Login:** Users can register with their email, verify their email address, and log in with their credentials or Google OAuth.
- **Task Management:** Create tasks with a title, description, and due date. Tasks can be marked as completed or deleted.
- **Dashboard Overview:** After logging in, users are shown a dashboard with statistics on completed and uncompleted tasks.
- **Task Filtering:** Filter tasks by completed, uncompleted, or view all.
- **Forgot Password:** Users can reset their password via email if they forget it.
- **Google OAuth:** Users can register or log in using their Google account for easier access.
- **State Management:** Vuex is used for centralized state management, ensuring smooth user interaction with the app.
- **Lazy Loading:** Tasks are displayed 10 at a time with an option to load more.

---

## 🚀 Live Demo

[Hosted App Link](https://prioritia.netlify.app)

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

## 🧪 Form Validation

Form validation is handled using Vuelidate for robust validation of user inputs (e.g., passwords, required fields, proper email format).

## 📦 State Management (Vuex)

The Vuex store handles:

- Fetching tasks from the API (actions)
- Mutations for adding, completing, and deleting tasks
- State for tasks and pagination control

## ✅ API Endpoints

The application interacts with the following ASP.NET Core API endpoints:

- **GET /api/tasks**: Fetches all tasks (paginated).
- **POST /api/tasks**: Adds a new task.
- **PUT /api/tasks/{id}**: Updates a task (where `{id}` is the task ID).
- **DELETE /api/tasks/{id}**: Deletes a task (where `{id}` is the task ID).
- **GET /api/tasks/completed**: Fetches completed tasks (paginated).
- **GET /api/tasks/uncompleted**: Fetches uncompleted tasks (paginated).

## 📦 Technologies Used

- Vue.js 3
- Vuex
- Bootstrap 5

## 🚀 API Used

- [Repository Link](https://github.com/nyamuda/TodoAPI)
- [Hosted App Link](https://quovoyapi.runasp.net/api/items)
