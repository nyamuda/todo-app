import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/styles.css";

/* Toast library start*/
import Toast, { POSITION } from "vue-toastification";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

import "vue-toastification/dist/index.css";
const options = { position: POSITION.TOP_CENTER };
/* Toast library end*/

createApp(App)
  .use(store)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .use(router)
  .use(Toast, options)
  .mount("#app");
