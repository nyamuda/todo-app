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
            <h6 class="text-dark fw-bold">
              <i class="fas fa-list-alt me-2"></i>Total Bookings
            </h6>
            <ProgressSpinner
              v-if="isGettingStatistics"
              style="width: 50px; height: 50px"
            />
            <p v-else class="display-6 fw-bold">
              {{ adminStatistics.totalBookings }}
            </p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-warning fw-bold">
              <i class="fas fa-clock me-2"></i>Pending Bookings
            </h6>
            <ProgressSpinner
              v-if="isGettingStatistics"
              style="width: 50px; height: 50px"
            />
            <p v-else class="display-6 fw-bold">
              {{ adminStatistics.totalPendingBookings }}
            </p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-success fw-bold">
              <i class="fas fa-check-circle me-2"></i>Confirmed Bookings
            </h6>
            <ProgressSpinner
              v-if="isGettingStatistics"
              style="width: 50px; height: 50px"
            />
            <p v-else class="display-6 fw-bold">
              {{ adminStatistics.totalConfirmedBookings }}
            </p>
          </div>
        </div>
      </div>

      <div class="row text-center">
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-primary fw-bold">
              <i class="fas fa-road me-2"></i>En Route
            </h6>
            <ProgressSpinner
              v-if="isGettingStatistics"
              style="width: 50px; height: 50px"
            />
            <p v-else class="display-6 fw-bold">
              {{ adminStatistics.totalEnRouteBookings }}
            </p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-success fw-bold">
              <i class="fas fa-check me-2"></i>Completed Bookings
            </h6>
            <ProgressSpinner
              v-if="isGettingStatistics"
              style="width: 50px; height: 50px"
            />
            <p v-else class="display-6 fw-bold">
              {{ adminStatistics.totalCompletedBookings }}
            </p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-danger fw-bold">
              <i class="fas fa-times-circle me-2"></i>Cancelled Bookings
            </h6>
            <ProgressSpinner
              v-if="isGettingStatistics"
              style="width: 50px; height: 50px"
            />
            <p v-else class="display-6 fw-bold">
              {{ adminStatistics.totalCancelledBookings }}
            </p>
          </div>
        </div>
      </div>
      <div class="row text-center">
        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-dark fw-bold">
              <i class="fas fa-users me-2"></i>Total Clients Registered
            </h6>
            <ProgressSpinner
              v-if="isGettingStatistics"
              style="width: 50px; height: 50px"
            />
            <p v-else class="display-6 fw-bold">
              {{ adminStatistics.totalRegisteredUsers }}
            </p>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="p-3 border rounded bg-light">
            <h6 class="text-dark fw-bold">
              <i class="fas fa-money-bill-wave me-2"></i>Total Revenue
            </h6>
            <ProgressSpinner
              v-if="isGettingStatistics"
              style="width: 50px; height: 50px"
            />
            <p v-else class="display-6 fw-bold">
              R{{ adminStatistics.totalRevenue }}
            </p>
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
import ProgressSpinner from "primevue/progressspinner";

const store = useStore();

let adminStatistics = computed(() => store.state.admin.adminStatistics);
let adminInfo = computed(() => store.state.account.loggedInUser);
let isGettingStatistics = computed(() => store.state.admin.isGettingStatistics);

onMounted(() => {
  //get user statistics such as the total number of bookings they have completed
  store.dispatch("admin/fetchAdminStatistics");
});
</script>
