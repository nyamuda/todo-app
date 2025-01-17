<template>
  <div class="m-auto">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Account Overview</h4>
      </div>
      <div class="card-body">
        <!-- User Info Section -->
        <div class="mb-4">
          <h5 class="fw-bold">
            Welcome, <span id="userName">{{ userInfo.name }}</span
            >!
          </h5>
        </div>

        <!-- Task Statistics Section -->
        <div class="row text-center">
          <div class="col-md-6 mb-3">
            <div class="p-3 border rounded bg-light">
              <h6 class="text-success fw-bold">Completed Tasks</h6>
              <p class="display-6 fw-bold" id="completedTasks">
                {{ userStatistics.totalCompletedItems }}
              </p>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="p-3 border rounded bg-light">
              <h6 class="text-warning fw-bold">Pending Tasks</h6>
              <p class="display-6 fw-bold" id="pendingTasks">
                {{ userStatistics.totalUncompletedItems }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-end">
        <router-link to="/tasks/list"
          ><button class="btn btn-outline-primary">
            View Tasks
          </button></router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

let userStatistics = computed(() => store.state.userStatistics);
let userInfo = computed(() => store.state.loggedInUser);

onMounted(() => {
  //get user statistics such as the total number of items they have completed
  store.dispatch("fetchTUserStatistics");
});
</script>
