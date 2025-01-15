import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TaskListView from "../views/Tasks/TaskListView.vue";
import TaskAddView from "../views/Tasks/TaskAddView.vue";
import LoginView from "@/views/Account/LoginView.vue";
import EmailVerificationView from "@/views/Account/EmailVerificationView.vue";
import RegisterView from "@/views/Account/RegisterView.vue";
import PasswordForgotView from "@/views/Account/PasswordForgotView.vue";
import EmailVerificationResultView from "@/views/Account/EmailVerificationResultView.vue";
import PasswordForgotEmailView from "@/views/Account/PasswordForgotEmailView.vue";
import PasswordResetView from "@/views/Account/PasswordResetView.vue";
import UserDashboardView from "@/views/Account/UserDashboardView.vue";
import store from "@/store";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
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
        path: "",
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
        name: "VerifyEmail",
        component: EmailVerificationView,
      },
      {
        path: "verify/token",
        name: "VerificationResult",
        component: EmailVerificationResultView,
      },
      {
        path: "password/forgot",
        name: "PasswordForgot",
        component: PasswordForgotView,
      },

      {
        path: "password/forgot/email",
        name: "PasswordForgotEmail",
        component: PasswordForgotEmailView,
      },
      {
        path: "password/reset",
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
