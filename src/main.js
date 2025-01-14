import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/styles.css";

/* Toast library start*/
import Toast from "vue-toastification";

import "vue-toastification/dist/index.css";
const options = {};
/* Toast library end*/

createApp(App).use(store).use(router).use(Toast, options).mount("#app");
