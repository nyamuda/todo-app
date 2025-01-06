<template>
  <div class="container mt-4">
    <h3>Task List</h3>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>{{ task.dueDate }}</td>
          <td>
            <span
              :class="{
                'text-success': task.completed,
                'text-danger': !task.completed,
              }"
            >
              {{ task.completed ? "Completed" : "Pending" }}
            </span>
          </td>
          <td>
            <button
              class="btn btn-success btn-sm me-2"
              @click="markCompleted(index)"
            >
              Mark Completed
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteTask(index)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        {
          title: "Buy groceries",
          description: "Milk, Bread, Eggs",
          dueDate: "2025-01-10",
          completed: false,
        },
        {
          title: "Finish project",
          description: "Complete Vue.js app",
          dueDate: "2025-01-15",
          completed: false,
        },
      ],
    };
  },
  methods: {
    markCompleted(index) {
      this.tasks[index].completed = true;
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
  },
};
</script>

<style>
.container {
  max-width: 800px;
}
</style>
