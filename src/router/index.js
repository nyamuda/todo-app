import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Common/HomeView.vue";
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
import StatusesView from "@/views/Statuses/StatusesView.vue";
import StatusesList from "@/components/Statuses/StatusesList.vue";
import AddStatus from "@/components/Statuses/AddStatus.vue";
import UpdateStatus from "@/components/Statuses/UpdateStatus.vue";
import AdminBookingDetails from "@/components/Admin/AdminBookingDetails.vue";
import BookingDetails from "@/components/Bookings/BookingDetails.vue";
import AdminBookingUpdate from "@/components/Admin/AdminBookingUpdate.vue";
import FeaturesView from "@/views/Features/FeaturesView.vue";
import FeaturesList from "@/components/Features/FeaturesList.vue";
import AddFeature from "@/components/Features/AddFeature.vue";
import UpdateFeature from "@/components/Features/UpdateFeature.vue";
import ServiceDetails from "@/components/Services/ServiceDetails.vue";
import UpdateService from "@/components/Services/UpdateService.vue";
import AdminDrawer from "@/components/Admin/AdminDrawer.vue";
import UserDashboard from "@/components/Account/UserDashboard.vue";
import LoginUser from "@/components/Account/LoginUser.vue";
import RegisterUser from "@/components/Account/RegisterUser.vue";
import PasswordReset from "@/components/Account/PasswordReset.vue";
import VerificationResult from "@/components/Account/VerificationResult.vue";
import AccountView from "@/views/Account/AccountView.vue";

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
        path: ":id/update",
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
      {
        path: ":id/details",
        name: "BookingDetails",
        component: BookingDetails,
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
      {
        path: "",
        name: "ServicesList",
        component: ServicesList,
      },
      //Only admins can add services
      {
        path: "add",
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
      //Only admins can update services
      {
        path: ":id/update",
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
      {
        path: ":id/details",
        name: " ServiceDetails",
        component: ServiceDetails,
      },
    ],
  },
  //Booking statuses routes
  //Only admins have access to these routes
  {
    path: "/statuses",
    name: "Statuses",
    component: StatusesView,
    beforeEnter: (to) => {
      if (!store.state.account.loggedInUser.isAdmin) {
        store.commit("account/setAttemptedUrl", to.fullPath); // Save the attempted URL
        return { name: "Login" }; // Redirect to login page
      }
      return true;
    },
    children: [
      {
        path: "",
        name: "StatusesList",
        component: StatusesList,
      },
      //only admins can add a booking status
      {
        path: "add",
        name: "AddStatus",
        component: AddStatus,
      },
      //only admins can update a booking status
      {
        path: "update/:id",
        name: " UpdateStatus",
        component: UpdateStatus,
      },
    ],
  },
  //Car wash features routes
  //Only admins have access to these routes
  {
    path: "/features",
    name: "Features",
    component: FeaturesView,
    beforeEnter: (to) => {
      if (!store.state.account.loggedInUser.isAdmin) {
        store.commit("account/setAttemptedUrl", to.fullPath); // Save the attempted URL
        return { name: "Login" }; // Redirect to login page
      }
      return true;
    },
    children: [
      {
        path: "",
        name: "FeaturesList",
        component: FeaturesList,
      },

      {
        path: "add",
        name: "AddFeature",
        component: AddFeature,
      },

      {
        path: ":id/update",
        name: " UpdateFeature",
        component: UpdateFeature,
      },
    ],
  },

  //Account Routes
  {
    path: "/account",
    component: AccountView,
    children: [
      {
        path: "",
        component: UserDashboard,
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
        component: LoginUser,
      },
      {
        path: "register",
        name: "Register",
        component: RegisterUser,
      },

      {
        path: "verify",
        name: "VerificationResult",
        component: VerificationResult,
      },

      {
        path: "password-reset",
        name: "PasswordReset",
        component: PasswordReset,
      },
      {
        path: "login/oauth/google/callback", //Google Oauth redirect URL
        name: "GoogleLogin",
        component: LoginUser,
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
      {
        path: "bookings/:id/details",
        name: "AdminBookingDetails",
        component: AdminBookingDetails,
      },
      {
        path: "bookings/:id/update",
        name: "AdminBookingUpdate",
        component: AdminBookingUpdate,
      },
      {
        path: "drawer",
        name: "AdminDrawer",
        component: AdminDrawer,
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
