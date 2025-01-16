import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Common/HomeView.vue";
import TaskListView from "../views/Tasks/TaskListView.vue";
import TaskAddView from "../views/Tasks/TaskAddView.vue";
import LoginView from "@/views/Account/LoginView.vue";
import EmailVerificationView from "@/views/Email/EmailVerificationView.vue";
import RegisterView from "@/views/Account/RegisterView.vue";
import PasswordForgotView from "@/views/Account/PasswordForgotView.vue";
import VerificationResultView from "@/views/Account/VerificationResultView.vue";
import PasswordForgotEmailView from "@/views/Email/PasswordForgotEmailView.vue";
import PasswordResetView from "@/views/Account/PasswordResetView.vue";
import UserDashboardView from "@/views/Account/UserDashboardView.vue";
import ContactUsView from "@/views/Common/ContactUsView.vue";
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
  {
    path: "/email",
    children:[
      {
        path: "verify",
        name: "VerifyEmail",
        component: EmailVerificationView,
      },
      {
        path: "password",
        name: "PasswordForgotEmail",
        component: PasswordForgotEmailView,
      },
    ]
  },

  {
    path: "/tasks",
    component: TaskListView,
    name: "Tasks",
    beforeEnter: (to) => {
      if (!store.state.isAuthenticated) {
        store.commit("setAttemptedUrl", to.fullPath); // Save the attempted URL
        return { name: "Login" }; // Redirect to login page
      }
      return true;
    },
    children: [{ path: "add", name: "AddTask", component: TaskAddView }],
  },
  {
    path: "/account",
    children: [
      {
        path: "/user",
        component: UserDashboardView,
        name: "UserDashboard",
        beforeEnter: (to) => {
          if (!store.state.isAuthenticated) {
            store.commit("setAttemptedUrl", to.fullPath); // Save the attempted URL
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
        path: "password-forgot",
        name: "PasswordForgot",
        component: PasswordForgotView,
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
