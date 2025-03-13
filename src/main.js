import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import "./assets/styles.css";

// Carousel library start
import "vue3-carousel/carousel.css";
// Carousel library end

/* Toast library start*/
import Toast, { POSITION } from "vue-toastification";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

import "vue-toastification/dist/index.css";
const options = { position: POSITION.TOP_CENTER };
/* Toast library end*/

createApp(App)
  .use(store)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
    ripple: true,
  })
  .use(ConfirmationService)
  .use(ToastService)
  .use(router)
  .use(Toast, options)
  .mount("#app");
