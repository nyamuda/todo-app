import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/styles.css";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
    components,
    directives,
  })

/* Toast library start*/
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const options = {};
/* Toast library end*/

createApp(App).use(store).use(router).use(vuetify).use(Toast, options).mount("#app");
