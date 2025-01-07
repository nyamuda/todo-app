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
              v-bind:class="{
                'text-success': task.isCompleted,
                'text-danger': !task.isCompleted,
              }"
            >
              {{ task.isCompleted ? "Completed" : "Pending" }}
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

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const tasks = ref([]);
const apiUrl = "http://quovoyapi.runasp.net/api";

onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}/items`);

    //get the tasks and format the date
    let tasksWithFormattedDate = response.data.map((task) => {
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate).toLocaleString(), // Format the dueDate
      };
    });

    tasks.value = tasksWithFormattedDate;
  } catch (error) {
    console.log("Error");
  }
});
</script>

<style>
.container {
  max-width: 800px;
}
</style>
