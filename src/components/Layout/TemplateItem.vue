<template>
  <!-- Topbar Start -->
  <div class="container-fluid topbar bg-secondary d-none d-xl-block w-100">
    <div class="container">
      <div class="row gx-0 align-items-center" style="height: 45px">
        <div class="col-lg-6 text-center text-lg-start mb-lg-0">
          <div class="h-100 d-inline-flex align-items-center me-4">
            <i class="fa fa-map-marker-alt text-primary me-2"></i>
            <p class="m-0">123 Street, Cape Town, South Africa</p>
          </div>
          <div class="h-100 d-inline-flex align-items-center me-4">
            <i class="far fa-envelope-open text-primary me-2"></i>
            <p class="m-0">nya20002@byui.edu</p>
          </div>
        </div>
        <div class="col-lg-6 text-center text-lg-end">
          <div class="h-100 d-inline-flex align-items-center">
            <a
              class="btn btn-sm-square bg-white text-primary me-1"
              href="https://github.com/nyamuda"
              target="_blank"
              ><i class="fab fa-github"></i
            ></a>

            <a
              class="btn btn-sm-square bg-white text-primary me-1"
              href="https://www.linkedin.com/in/nyamuda/"
              target="_blank"
              ><i class="fab fa-linkedin-in"></i
            ></a>
            <a
              class="btn btn-sm-square bg-white text-primary me-0"
              href="https://nyamuda.netlify.app/"
              target="_blank"
              ><i class="fas fa-briefcase"></i
            ></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Topbar End -->
</template>

<style scoped>
/*** Custom Navbar ***/
.custom-navbar {
  padding: 0 20px;
}

.custom-nav {
  position: relative;
  z-index: 1000;
}

.site-title {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}

.navbar-toggler {
  border: none;
  font-size: 20px;
  background: none;
}

.navbar-nav .nav-link {
  padding: 10px 15px;
  color: #333;
  font-weight: 600;
  text-transform: uppercase;
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.active {
  color: #007bff;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(10px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}

.nav-item:hover .dropdown-menu {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.contact-box {
  background: #007bff;
  padding: 8px 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  color: white;
}

.icon-container {
  background: white;
  color: #007bff;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 10px;
}

.contact-text p {
  margin: 0;
  font-size: 12px;
}

.contact-text h5 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

/* Responsive Tweaks */
@media (max-width: 991px) {
  .navbar-nav {
    text-align: center;
    border-top: 1px solid #ddd;
    padding-top: 10px;
  }

  .nav-link {
    padding: 8px;
  }
}
</style>
