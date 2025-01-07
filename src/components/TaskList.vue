<template>
  <div class="container m-auto mt-5">
    <h3>Task List</h3>

    <div class="d-flex justify-content-end">
      <button type="button" class="btn btn-dark">Add Task</button>
    </div>
    <table class="table table-striped mt-3">
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
        <!-- Show placeholders while loading -->
        <template v-if="isGettingItems">
          <tr v-for="n in 5" :key="n">
            <td><span class="placeholder col-6"></span></td>
            <td><span class="placeholder col-8"></span></td>
            <td><span class="placeholder col-4"></span></td>
            <td><span class="placeholder col-3"></span></td>
            <td><span class="placeholder col-4"></span></td>
          </tr>
        </template>
        <!-- Show tasks once loaded -->
        <template v-else>
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
              <button class="btn btn-danger" @click="confirmDelete(task.id)">
                Delete
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
  <!-- Modal Start-->
  <div
    v-if="showModal"
    class="modal fade show"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    style="display: block; background: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Delete Task ?</h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="closeModal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteTask(clickedItemId)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal End-->
  <!--Toast-->
  <ToastItem ref="toastRef"></ToastItem>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import ToastItem from "./ToastItem.vue";
import axios from "axios";

import { useStore } from "vuex";
// Access the store
const store = useStore();
let pendingDeleteTaskId = ref(0);
let showModal = ref(false);
const toastRef = ref(null);

onMounted(async () => {
  //get all items
  store.dispatch("fetchTasks");
});

let tasks = computed(() => store.state.todoTasks);
let isGettingItems = computed(() => store.state.isGettingItems);

//let the user confirm deleting an item
//by showing a modal
const confirmDelete = (id) => {
  showModal.value = true;
  pendingDeleteTaskId.value = id;
};
// Close the modal
const closeModal = () => {
  showModal.value = false;
};

let showToast = (message) => {
  store.commit("addToastMessage", message);
  if (toastRef.value) {
    toastRef.value.showToast(); // Call the child component's method
  }
};

//delete a task and hide the modal
let deleteTask = async () => {
  try {
    showModal.value = false;
    // Send a DELETE request to the API
    let response = await axios.delete(
      `${store.state.apiUrl}/${pendingDeleteTaskId.value}`
    );

    // Check if the request was successful
    //status code will be 204 from the API
    if (response.status == 204) {
      //show success message
      let message = "The task has been successfully deleted.";
      showToast(message);

      //refresh the list of items
      //get all items
      store.dispatch("fetchTasks");
    } else {
      showToast(store.state.failureMessage);
      console.error("Failed to delete task:", response.statusText);
    }
  } catch (error) {
    showToast(store.state.failureMessage);
    console.error("Error deleting task:", error);
  }
};
</script>

<style></style>
