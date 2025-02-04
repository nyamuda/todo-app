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
import store from "@/store";
import AdminDashboard from "@/components/Admin/AdminDashboard.vue";
import AdminView from "@/views/Admin/AdminView.vue";
import BookingsView from "@/views/Bookings/BookingsView.vue";
import BookingsList from "@/components/Bookings/BookingsList.vue";
import AddBooking from "@/components/Bookings/AddBooking.vue";
import UpdateBooking from "@/components/Bookings/UpdateBooking.vue";
import AdminBookingsList from "@/components/Admin/AdminBookingsList.vue";
import ServicesView from "@/views/Services/ServicesView.vue";
import ServicesList from "@/components/Services/ServicesList.vue";
import AddService from "@/components/Services/AddService.vue";
import UpdateService from "@/components/Services/UpdateService.vue";

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
  //Bookings routes
  {
    path: "/bookings",
    name: "Bookings",
    component: BookingsView,
    children: [
      {
        path: "",
        name: "BookingsList",
        component: BookingsList,
        beforeEnter: (to) => {
          if (!store.state.account.isAuthenticated) {
            store.commit("account/setAttemptedUrl", to.fullPath); // Save the attempted URL
            return { name: "Login" }; // Redirect to login page
          }
          return true;
        },
      },
      {
        path: "add",
        name: "AddBooking",
        component: AddBooking,
      },
      {
        path: "update",
        name: "UpdateBooking",
        component: UpdateBooking,
        beforeEnter: (to) => {
          if (!store.state.account.isAuthenticated) {
            store.commit("account/setAttemptedUrl", to.fullPath); // Save the attempted URL
            return { name: "Login" }; // Redirect to login page
          }
          return true;
        },
      },
    ],
  },

  //Car wash services routes
  {
    path: "/services",
    name: "Services",
    component: ServicesView,
    children: [
      //only admins can see the service types list component --> has delete & update actions
      {
        path: "services",
        name: "ServicesList",
        component: ServicesList,
        beforeEnter: (to) => {
          if (!store.state.account.loggedInUser.isAdmin) {
            store.commit("account/setAttemptedUrl", to.fullPath); // Save the attempted URL
            return { name: "Login" }; // Redirect to login page
          }
          return true;
        },
      },
      //only admins can add a car wash service type
      {
        path: "services/add",
        name: "AddService",
        component: AddService,
        beforeEnter: (to) => {
          if (!store.state.account.loggedInUser.isAdmin) {
            store.commit("account/setAttemptedUrl", to.fullPath); // Save the attempted URL
            return { name: "Login" }; // Redirect to login page
          }
          return true;
        },
      },
      //only admins can update a booking service type
      {
        path: "services/update",
        name: " UpdateService",
        component: UpdateService,
        beforeEnter: (to) => {
          if (!store.state.account.loggedInUser.isAdmin) {
            store.commit("account/setAttemptedUrl", to.fullPath); // Save the attempted URL
            return { name: "Login" }; // Redirect to login page
          }
          return true;
        },
      },
    ],
  },

  //Account Routes
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
  //Admin routes
  {
    path: "/admin",
    component: AdminView,
    name: "Admin",
    beforeEnter: (to) => {
      if (!store.state.account.loggedInUser.isAdmin) {
        store.commit("account/setAttemptedUrl", to.fullPath); // Save the attempted URL
        return { name: "Login" }; // Redirect to login page
      }
      return true;
    },

    children: [
      { path: "", name: "AdminDashboard", component: AdminDashboard },
      {
        path: "bookings",
        name: "AdminBookingList",
        component: AdminBookingsList,
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
