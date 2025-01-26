<template>
  <div class="container mx-auto">
    <h3>Task List</h3>

    <div class="d-flex justify-content-end">
      <div class="me-2">
        <select
          v-model="filterBookingsBy"
          @change="filterBookings"
          class="form-select"
          aria-label="Filter bookings"
        >
          <option value="all" selected>All tasks</option>
          <option value="completed">Completed tasks</option>
          <option value="uncompleted">Uncompleted tasks</option>
        </select>
      </div>
      <router-link to="/tasks/add">
        <button type="button" class="btn btn-primary">Add Task</button>
      </router-link>
    </div>

    <!--Tasks Table Start-->
    <div v-if="tasks.length > 0 || hasMoreBookings">
      <div class="table-responsive">
        <table class="table table-striped mt-3 placeholder-glow">
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
            <template v-if="isGettingBookings">
              <tr v-for="n in 5" :key="n">
                <td><span class="placeholder col-6"></span></td>
                <td><span class="placeholder col-8"></span></td>
                <td><span class="placeholder col-4"></span></td>
                <td><span class="placeholder col-3"></span></td>
                <td><span class="placeholder col-6"></span></td>
              </tr>
            </template>
            <!-- Show tasks once loaded -->
            <template v-else>
              <tr
                class="booking-list"
                v-for="(task, index) in tasks"
                :key="index"
              >
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
                  <div
                    class="d-flex justify-content-start align-bookings-center flex-nowrap"
                  >
                    <button
                      v-if="
                        isCompletingBooking && pendingUpdateTaskId == task.id
                      "
                      class="btn btn-success btn-sm me-2"
                      disabled
                    >
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Please wait...
                    </button>
                    <button
                      v-else
                      :disabled="task.isCompleted"
                      class="btn btn-success btn-sm me-2 text-nowrap"
                      @click="markCompleted(task.id)"
                    >
                      Mark Completed
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      @click="confirmDelete(task.id)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <!--Load more bookings start-->
      <div class="d-grid gap-2 col-md-3 mx-auto mt-3 mt-md-2">
        <button
          :class="{
            'btn btn-secondary': !hasMoreBookings,
            'btn btn-primary': hasMoreBookings,
          }"
          @click="loadMoreBookings"
          :disabled="isLoadingMoreBookings || !hasMoreBookings"
        >
          <span
            v-if="isLoadingMoreBookings"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isLoadingMoreBookings ? "Loading..." : "Load more" }}
        </button>
      </div>
      <!--Load more bookings end-->
    </div>

    <!--No Bookings  Start-->
    <div
      v-else
      class="d-flex justify-content-center align-bookings-center flex-column text-center py-5 bg-light rounded-3 shadow-sm mt-5"
    >
      <div class="mb-2">
        <!-- Font Awesome Icon for no bookings -->
        <i class="fas fa-car fa-3x text-primary"></i>
      </div>
      <p class="fs-4 text-muted mb-2">You have no bookings at the moment.</p>
      <p class="text-muted">
        Don't wait! Book a car wash now and let us handle the rest.
      </p>
    </div>

    <!--No Bookings End-->
  </div>
  <!--Tasks Table End-->

  <!-- Modal Start-->
  <div
    v-if="showModal"
    class="modal fade show"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    style="display: block; background: rgba(0, 0, 0, 0.5); z-index: 10000"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Delete Task?</h5>
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
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Close
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteTask(clickedBookingId)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal End-->
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

import { useStore } from "vuex";
// Access the store
const store = useStore();
let pendingDeleteTaskId = ref(0); //id of booking to be deleted
let pendingUpdateTaskId = ref(0); //id of booking to be updated
let showModal = ref(false);
let filterBookingsBy = ref("all");

onMounted(async () => {
  //get all bookings
  store.dispatch("bookings/fetchTasks");
});

let tasks = computed(() => store.state.bookings.todoTasks);
let isGettingBookings = computed(() => store.state.bookings.isGettingBookings);

//let the user confirm deleting an booking
//by showing a modal
const confirmDelete = (id) => {
  showModal.value = true;
  pendingDeleteTaskId.value = id;
};
// Close the modal
const closeModal = () => {
  showModal.value = false;
};

//delete a task and hide the modal
let deleteTask = () => {
  showModal.value = false;
  store.dispatch("bookings/deleteTask", pendingDeleteTaskId.value);
};
//mark task as completed
let markCompleted = (id) => {
  pendingUpdateTaskId.value = id;
  store.dispatch("bookings/completeTask", id);
};

let filterBookings = () => {
  if (filterBookingsBy.value == "completed") {
    store.dispatch("bookings/fetchCompletedTasks");
  } else if (filterBookingsBy.value == "uncompleted") {
    store.dispatch("bookings/fetchUncompletedTasks");
  } else {
    store.dispatch("bookings/fetchTasks");
  }
};
//load more tasks depending on whether
//the current list is for all, completed or uncompleted tasks
let loadMoreBookings = () => {
  store.dispatch("bookings/loadMoreTasks", filterBookingsBy.value);
};
//is an booking being marked as complete
let isCompletingBooking = computed(
  () => store.state.bookings.isCompletingBooking
);

//are there more bookings currently being loaded
let isLoadingMoreBookings = computed(
  () => store.state.bookings.isLoadingMoreBookings
);

//are there still more bookings that can be loaded
let hasMoreBookings = computed(
  () => store.state.bookings.bookingsPageInfo.hasMore
);
</script>

<style>
.booking-list {
  animation: fadeIn 0.5s ease-in-out;
}
.modal {
  animation: fadeIn 0.3s ease-in-out;
}
/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
