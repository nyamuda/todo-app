<template>
  <section
    id="hero"
    style="
      background-image: url(https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
      background-repeat: no-repeat;
    "
  >
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 pe-5 mt-5 mt-md-0">
          <h2 class="display-1 text-uppercase">Organize Your Life</h2>
          <p class="fs-4 my-4 pb-2">
            Stay on top of your tasks with our simple and to-do list app.
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

#hero {
  animation: fadeIn 0.2s ease-out;
}
/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
