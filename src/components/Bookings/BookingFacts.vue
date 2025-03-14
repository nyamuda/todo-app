<template>
  <div class="m-auto">
    <div class="card shadow-sm">
      <div class="card-body">
        <!-- Booking Statistics Section -->
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
                {{ userStatistics.totalBookings }}
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
                {{ userStatistics.totalPendingBookings }}
              </p>
            </div>
          </div>

          <div class="col-md-4 mb-3">
            <div class="p-3 border rounded bg-light">
              <h6 class="text-info fw-bold">
                <i class="fas fa-check-circle me-2"></i>Confirmed Bookings
              </h6>
              <ProgressSpinner
                v-if="isGettingStatistics"
                style="width: 50px; height: 50px"
              />
              <p v-else class="display-6 fw-bold">
                {{ userStatistics.totalConfirmedBookings }}
              </p>
            </div>
          </div>
        </div>
        <div class="row text-center">
          <div class="col-md-6 mb-3">
            <div class="p-3 border rounded bg-light">
              <h6 class="text-success fw-bold">
                <i class="fas fa-check me-2"></i>Completed Bookings
              </h6>
              <ProgressSpinner
                v-if="isGettingStatistics"
                style="width: 50px; height: 50px"
              />
              <p v-else class="display-6 fw-bold">
                {{ userStatistics.totalCompletedBookings }}
              </p>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="p-3 border rounded bg-light">
              <h6 class="text-danger fw-bold">
                <i class="fas fa-times-circle me-2"></i>Cancelled Bookings
              </h6>
              <ProgressSpinner
                v-if="isGettingStatistics"
                style="width: 50px; height: 50px"
              />
              <p v-else class="display-6 fw-bold">
                {{ userStatistics.totalCancelledBookings }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-end">
        <router-link to="/bookings"
          ><button class="btn btn-secondary">View Bookings</button></router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import ProgressSpinner from "primevue/progressspinner";
import { useToast } from "primevue/usetoast";

const store = useStore();
const toast = useToast();

let userStatistics = computed(() => store.state.bookings.userStatistics);
let isGettingStatistics = computed(
  () => store.state.bookings.isGettingStatistics
);

onMounted(() => {
  //get user statistics such as the total number of bookings they have completed
  store
    .dispatch("bookings/fetchUserStatistics")
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 3000,
      });
    });
});
</script>
