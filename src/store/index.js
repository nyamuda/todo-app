import { createStore } from "vuex";
import account from "./modules/account";
import bookings from "./modules/bookings";
import admin from "./modules/admin";
import services from "./modules/services";
import statuses from "./modules/statuses";
import images from "./modules/images";
import features from "./modules/features";
import feedback from "./modules/feedback";
import company from "./modules/company";

export default createStore({
  state() {
    return {
      apiUrl: "https://localhost:7156/api",
      // apiUrl: "https://quovoyapi.runasp.net/api",

      isContactingUs: false, //to show loading button during contact us process
      failureMessage: "Oops! Something went wrong. Please try again.",
    };
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    account,
    bookings,
    admin,
    services,
    statuses,
    images,
    features,
    feedback,
    company,
  },
});
