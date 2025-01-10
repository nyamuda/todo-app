<template>
  <section
    id="hero"
    style="
      background-image: url(../../assets/img/hero-bg.jpg);
      background-repeat: no-repeat;
    "
  >
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 pe-5 mt-5 mt-md-0">
          <h2 class="display-1 text-uppercase">Organize Your Life</h2>
          <p class="fs-4 my-4 pb-2">
            Stay on top of your tasks with our simple to-do list app.
          </p>
          <div>
            <router-link to="/tasks/add">
              <button class="submit-button px-5 py-3">
                Get Started
              </button></router-link
            >
          </div>
        </div>
        <div class="col-md-6 mt-5">
          <img src="../../assets/img/hero1.png" alt="img" class="img-fluid" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.action-btn {
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: 600;
  border-radius: 60px;
  transition: all 0.3s ease-in;
  background-color: var(--accent-color);
  border: none;
}
.action-btn:hover {
  background-color: darken(var(--accent-color), 10%) !important;
  background-color: var(--accent-color);
}
</style>
