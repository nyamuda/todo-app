<template>
  <div class="card d-flex justify-content-center">
    <Drawer v-model:visible="visible">
      <template #container="{ closeCallback }">
        <div class="d-flex flex-column h-100">
          <div
            class="d-flex align-items-center justify-content-between px-3 pt-3 flex-shrink-0"
          >
            <span class="d-inline-flex align-items-center gap-2">
              <svg
                width="35"
                height="40"
                viewBox="0 0 35 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
                  fill="var(--p-primary-color)"
                />
                <path
                  d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
                  fill="var(--p-text-color)"
                />
              </svg>
              <span class="fw-semibold fs-4 text-primary">Your Logo</span>
            </span>
            <span>
              <Button
                type="button"
                @click="closeCallback"
                icon="pi pi-times"
                class="btn btn-outline-secondary rounded-circle"
              ></Button>
            </span>
          </div>
          <div class="overflow-auto">
            <ul class="list-unstyled p-3 m-0">
              <li>
                <div
                  v-ripple
                  v-styleclass="{
                    selector: '@next',
                    enterFromClass: 'd-none',
                    enterActiveClass: 'animate-slidedown',
                    leaveToClass: 'd-none',
                    leaveActiveClass: 'animate-slideup',
                  }"
                  class="p-3 d-flex align-items-center justify-content-between text-secondary cursor-pointer p-ripple"
                >
                  <span class="fw-medium">FAVORITES</span>
                  <i class="pi pi-chevron-down"></i>
                </div>
                <ul class="list-unstyled p-0 m-0 overflow-hidden">
                  <li>
                    <a
                      v-ripple
                      class="d-flex align-items-center cursor-pointer p-3 rounded text-dark text-decoration-none hover-bg-light transition"
                    >
                      <i class="pi pi-home me-2"></i>
                      <span class="fw-medium">Dashboard</span>
                    </a>
                  </li>
                  <li>
                    <a
                      v-ripple
                      class="d-flex align-items-center cursor-pointer p-3 rounded text-dark text-decoration-none hover-bg-light transition"
                    >
                      <i class="pi pi-bookmark me-2"></i>
                      <span class="fw-medium">Bookmarks</span>
                    </a>
                  </li>
                  <li>
                    <a
                      v-ripple
                      v-styleclass="{
                        selector: '@next',
                        enterFromClass: 'd-none',
                        enterActiveClass: 'animate-slidedown',
                        leaveToClass: 'd-none',
                        leaveActiveClass: 'animate-slideup',
                      }"
                      class="d-flex align-items-center cursor-pointer p-3 rounded text-dark text-decoration-none hover-bg-light transition"
                    >
                      <i class="pi pi-chart-line me-2"></i>
                      <span class="fw-medium">Reports</span>
                      <i class="pi pi-chevron-down ms-auto"></i>
                    </a>
                    <ul
                      class="list-unstyled ps-3 pe-0 m-0 d-none overflow-hidden transition-all"
                    >
                      <li>
                        <a
                          v-ripple
                          class="d-flex align-items-center cursor-pointer p-3 rounded text-dark text-decoration-none hover-bg-light transition"
                        >
                          <i class="pi pi-table me-2"></i>
                          <span class="fw-medium">View</span>
                        </a>
                      </li>
                      <li>
                        <a
                          v-ripple
                          class="d-flex align-items-center cursor-pointer p-3 rounded text-dark text-decoration-none hover-bg-light transition"
                        >
                          <i class="pi pi-search me-2"></i>
                          <span class="fw-medium">Search</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="mt-auto">
            <hr class="mb-3 mx-3 border-0 border-top border-secondary" />
            <a
              v-ripple
              class="m-3 d-flex align-items-center cursor-pointer p-3 gap-2 rounded text-dark text-decoration-none hover-bg-light transition"
            >
              <i class="pi pi-user me-2"></i>
              <span class="fw-medium">Profile</span>
            </a>
          </div>
        </div>
      </template>
    </Drawer>
    <Button icon="fas fa-bars" @click="visible = true" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";

import Drawer from "primevue/drawer";

const visible = ref(false);
</script>
