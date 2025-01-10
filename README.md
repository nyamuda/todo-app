# Vue 3 To-Do List App

A simple to-do list application built with Vue 3, Vuex for state management, and Bootstrap 5 for UI components. The app consumes an ASP.NET Core API and allows users to manage tasks with features like task addition, completion, filtering, and lazy loading.

## 🎯 Features

- **Add Tasks:** Users can add tasks with a title, description, and due date.
- **Task Completion:** Mark tasks as completed.
- **Task Filtering:** Filter tasks by completed, uncompleted, or view all.
- **Lazy Loading:** Tasks are displayed 10 at a time with an option to load more.
- **State Management:** Vuex is used for centralized state management.
- **Bootstrap 5:** For responsive UI components.
- **ASP.NET Core API:** Backend for task storage and retrieval.

---

## 🚀 Live Demo

[👉 Hosted App Link](https://your-hosted-app-link.com)

---

## 🛠️ Project Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Vue CLI (optional but recommended)

### Steps to Run the App

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/todo-list-app.git
   cd todo-list-app
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Development Server::**
   ```bash
   npm run serve
   ```

## Technologies Used

## Technologies Used

- Vue.js 3
- Vuex
- Bootstrap 5
- ASP.NET Core API (Backend)

## API Endpoints

The application interacts with the following ASP.NET Core API endpoints:

- **GET /api/tasks**: Fetches all tasks (paginated).
- **POST /api/tasks**: Adds a new task.
- **PUT /api/tasks/{id}**: Updates a task (where `{id}` is the task ID).
- **DELETE /api/tasks/{id}**: Deletes a task (where `{id}` is the task ID).
- **GET /api/tasks/completed**: Fetches completed tasks (paginated).
- **GET /api/tasks/uncompleted**: Fetches uncompleted tasks (paginated).
