import { createStore } from "vuex";
import account from "./modules/account";
import bookings from "./modules/bookings";
import admin from "./modules/admin";
import services from "./modules/services";

import { useToast } from "vue-toastification";
const toast = useToast();

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
  actions: {
    //Show toast notification
    showToast(context, payload) {
      const { message, severity } = payload;

      if (severity == "success") {
        toast.success(message);
      } else if (severity == "error") {
        toast.error(message);
      } else {
        toast(message);
      }
    },
  },
  modules: { account, bookings, admin, services },
});
