<template>
  <div class="card shadow-sm">
    <div class="card-header bg-dark text-white">
      <h4 class="mb-0">Admin Dashboard</h4>
    </div>
    <div class="card-body">
      <!-- Welcome Section -->
      <div class="mb-4">
        <h5 class="fw-bold">
          Welcome, <span id="adminName">{{ adminInfo.name }}</span>
        </h5>
        <p class="text-muted">Manage all bookings efficiently</p>
      </div>

      <!-- Booking Statistics Overview -->
      <div class="row text-center">
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-dark fw-bold">Total Bookings</h6>
            <p class="display-6 fw-bold">
              {{ adminStatistics.totalBookings }}
            </p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-warning fw-bold">Pending Bookings</h6>
            <p class="display-6 fw-bold">
              {{ adminStatistics.totalPendingBookings }}
            </p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-success fw-bold">Confirmed Bookings</h6>
            <p class="display-6 fw-bold">
              {{ adminStatistics.totalConfirmedBookings }}
            </p>
          </div>
        </div>
      </div>

      <div class="row text-center">
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-success fw-bold">En Route</h6>
            <p class="display-6 fw-bold">
              {{ adminStatistics.totalEnRouteBookings }}
            </p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-primary fw-bold">Completed Bookings</h6>
            <p class="display-6 fw-bold">
              {{ adminStatistics.totalCompletedBookings }}
            </p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-danger fw-bold">Cancelled Bookings</h6>
            <p class="display-6 fw-bold">
              {{ adminStatistics.totalCancelledBookings }}
            </p>
          </div>
        </div>
      </div>
      <div class="row text-center">
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-dark fw-bold">Total Clients Registered</h6>
            <p class="display-6 fw-bold">
              {{ adminStatistics.totalRegisteredUsers }}
            </p>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-success fw-bold">Total Revenue</h6>
            <p class="display-6 fw-bold">R{{ adminStatistics.totalRevenue }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card-footer text-end">
      <router-link to="/admin/bookings">
        <button class="btn btn-secondary">Manage Bookings</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

let adminStatistics = computed(() => store.state.admin.adminStatistics);
let adminInfo = computed(() => store.state.account.loggedInUser);

onMounted(() => {
  //get user statistics such as the total number of bookings they have completed
  store.dispatch("admin/fetchAdminStatistics");
});
</script>
