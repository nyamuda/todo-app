<template>
  <div class="m-auto">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Account Overview</h4>
      </div>
      <div class="card-body">
        <!-- User Info Section -->
        <div class="mb-4">
          <h5 class="fw-bold">Welcome, <span id="userName">John Doe</span>!</h5>
        </div>

        <!-- Task Statistics Section -->
        <div class="row text-center">
          <div class="col-md-6 mb-3">
            <div class="p-3 border rounded bg-light">
              <h6 class="text-success fw-bold">Completed Tasks</h6>
              <p class="display-6 fw-bold" id="completedTasks">12</p>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="p-3 border rounded bg-light">
              <h6 class="text-warning fw-bold">Pending Tasks</h6>
              <p class="display-6 fw-bold" id="pendingTasks">8</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-end">
        <button class="btn btn-outline-primary">View Tasks</button>
      </div>
    </div>
  </div>
</template>
