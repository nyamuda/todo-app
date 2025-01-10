<template>
  <div class="container m-auto mt-5">
    <h3>Task List</h3>

    <div class="d-flex justify-content-end">
      <div class="me-2">
        <select
          v-model="filterItemsBy"
          @change="filterItems"
          class="form-select"
          aria-label="Filter items"
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
    <div class="table-responsive">
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
              <td><span class="placeholder col-6"></span></td>
            </tr>
          </template>
          <!-- Show tasks once loaded -->
          <template v-else>
            <tr class="item-list" v-for="(task, index) in tasks" :key="index">
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
                  class="d-flex justify-content-start align-items-center flex-nowrap"
                >
                  <button
                    v-if="isCompletingItem && pendingUpdateTaskId == task.id"
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
    <!--Load more items start-->
    <div class="d-grid gap-2 col-md-3 mx-auto mt-3 mt-md-2">
      <button
        :class="{
          'btn btn-secondary': !hasMoreItems,
          'btn btn-primary': hasMoreItems,
        }"
        @click="loadMoreItems"
        :disabled="isLoadingMoreItems || !hasMoreItems"
      >
        <span
          v-if="isLoadingMoreItems"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        {{ isLoadingMoreItems ? "Loading..." : "Load more" }}
      </button>
    </div>
    <!--Load more items end-->
  </div>
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
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

import { useStore } from "vuex";
// Access the store
const store = useStore();
let pendingDeleteTaskId = ref(0); //id of item to be deleted
let pendingUpdateTaskId = ref(0); //id of item to be updated
let showModal = ref(false);
let filterItemsBy = ref("all");

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

//delete a task and hide the modal
let deleteTask = () => {
  showModal.value = false;
  store.dispatch("deleteTask", pendingDeleteTaskId.value);
};
//mark task as completed
let markCompleted = (id) => {
  pendingUpdateTaskId.value = id;
  store.dispatch("completeTask", id);
};

let filterItems = () => {
  if (filterItemsBy.value == "completed") {
    store.dispatch("fetchCompletedTasks");
  } else if (filterItemsBy.value == "uncompleted") {
    store.dispatch("fetchUncompletedTasks");
  } else {
    store.dispatch("fetchTasks");
  }
};
//load more tasks depending on whether
//the current list is for all, completed or uncompleted tasks
let loadMoreItems = () => {
  store.dispatch("loadMoreTasks", filterItemsBy.value);
};
//is an item being marked as complete
let isCompletingItem = computed(() => store.state.isCompletingItem);

//are there more items currently being loaded
let isLoadingMoreItems = computed(() => store.state.isLoadingMoreItems);

//are there still more items that can be loaded
let hasMoreItems = computed(() => store.state.itemsPageInfo.hasMore);
</script>

<style>
.item-list {
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
