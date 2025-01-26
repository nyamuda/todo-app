import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Common/HomeView.vue";
import LoginView from "@/views/Account/LoginView.vue";
import RegisterView from "@/views/Account/RegisterView.vue";
import VerificationResultView from "@/views/Account/VerificationResultView.vue";
import PasswordResetView from "@/views/Account/PasswordResetView.vue";
import UserDashboardView from "@/views/Account/UserDashboardView.vue";
import ContactUsView from "@/views/Common/ContactUsView.vue";
import SentPasswordForgotEmailView from "@/views/Email/SentPasswordForgotEmailView.vue";
import SendPasswordForgotEmailView from "@/views/Email/SendPasswordForgotEmailView.vue";
import SentEmailVerificationView from "@/views/Email/SentEmailVerificationView.vue";
import AddBookingView from "@/views/Bookings/AddBookingView.vue";
import BookingListView from "@/views/Bookings/BookingListView.vue";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactUsView,
  },
  //routes related to send sending an email
  {
    path: "/email",
    children: [
      {
        path: "verify",
        name: "VerifyEmail",
        component: SentEmailVerificationView,
      },
      {
        path: "password/sent",
        name: "PasswordForgotEmail",
        component: SentPasswordForgotEmailView,
      },
      {
        path: "password/send",
        name: "SendPasswordForgotEmail",
        component: SendPasswordForgotEmailView,
      },
    ],
  },
  {
    path: "/bookings/add",
    name: "AddBooking",
    component: AddBookingView,
  },

  {
    path: "/bookings",
    beforeEnter: (to) => {
      if (!store.state.account.isAuthenticated) {
        store.commit("account/setAttemptedUrl", to.fullPath); // Save the attempted URL
        return { name: "Login" }; // Redirect to login page
      }
      return true;
    },
    children: [
      { path: "list", name: "BookingsList", component: BookingListView },
    ],
  },

  {
    path: "/account",
    children: [
      {
        path: "user",
        component: UserDashboardView,
        name: "UserDashboard",
        beforeEnter: (to) => {
          if (!store.state.account.isAuthenticated) {
            store.commit("account/setAttemptedUrl", to.fullPath); // Save the attempted URL
            return { name: "Login" }; // Redirect to login page
          }
          return true;
        },
      },
      {
        path: "login",
        name: "Login",
        component: LoginView,
      },
      {
        path: "register",
        name: "Register",
        component: RegisterView,
      },

      {
        path: "verify",
        name: "VerificationResult",
        component: VerificationResultView,
      },

      {
        path: "password-reset",
        name: "PasswordReset",
        component: PasswordResetView,
      },
      {
        path: "login/oauth/google/callback", //Google Oauth redirect URL
        name: "GoogleLogin",
        component: LoginView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
