<template>
  <!-- About Start -->
  <div class="container-xxl py-5">
    <div class="container">
      <div class="row g-5 align-items-center">
        <!-- Left Column: Image Section -->
        <div
          class="d-none d-lg-block col-lg-6 wow fadeInUp"
          data-wow-delay="0.1s"
        >
          <div class="position-relative h-100">
            <img
              src="../../assets/img/about.png"
              alt="To-Do List App Interface"
              class="img-fluid rounded-lg"
            />
          </div>
        </div>

        <!-- Right Column: Content Section -->
        <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
          <div class="h-100">
            <div class="mb-5">
              <h6 class="text-primary text-uppercase mb-2">About Us</h6>
              <h1 class="display-6 mb-4">Organize Your Tasks</h1>
              <p class="mb-4">
                Our to-do list app is designed to help you stay organized and
                productive. Whether you're managing daily tasks, tracking
                deadlines, or prioritizing your goals, our app makes it easy to
                keep everything in one place.
              </p>
            </div>
            <div class="row g-4">
              <div class="col-sm-6 d-flex">
                <div class="bg-light p-3 rounded me-3">
                  <i class="fa fa-tasks fa-2x text-primary"></i>
                </div>
                <div>
                  <h6 class="mb-1 fw-bold">Task Management</h6>
                  <p class="mb-0">Easily organize tasks.</p>
                </div>
              </div>
              <div class="col-sm-6 d-flex">
                <div class="bg-light p-3 rounded me-3">
                  <i class="fa fa-calendar-check fa-2x text-primary"></i>
                </div>
                <div>
                  <h6 class="mb-1 fw-bold">Due Date Tracking</h6>
                  <p class="mb-0">Never miss a deadline again.</p>
                </div>
              </div>
              <div class="col-sm-6 d-flex">
                <div class="bg-light p-3 rounded me-3">
                  <i class="fa fa-filter fa-2x text-primary"></i>
                </div>
                <div>
                  <h6 class="mb-1 fw-bold">Task Filtering</h6>
                  <p class="mb-0">Filter tasks by status.</p>
                </div>
              </div>
              <div class="col-sm-6 d-flex">
                <div class="bg-light p-3 rounded me-3">
                  <i class="fa fa-spinner fa-2x text-primary"></i>
                </div>
                <div>
                  <h6 class="mb-1 fw-bold">Lazy Loading</h6>
                  <p class="mb-0">Load tasks dynamically.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- About End -->
</template>

<script setup></script>
