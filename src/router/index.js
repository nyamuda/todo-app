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

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/tasks",
    name: "tasks",
    component: TaskListView,
  },
  {
    path: "/tasks/add",
    name: "addTask",
    component: TaskAddView,
  },

  {
    path: "/account/login",
    name: "login",
    component: LoginView,
  },
  //Google Oauth redirect URL
  {
    path: "/account/login/oauth/google/callback",
    name: "googleLogin",
    component: LoginView,
  },
  {
    path: "/account/verify",
    name: "emailVerification",
    component: EmailVerificationView,
  },
  {
    path: "/account/verify/token",
    name: "emailVerificationResult",
    component: EmailVerificationResultView,
  },
  {
    path: "/account/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/account/password/forgot",
    name: "forgotPassword",
    component: PasswordForgotView,
  },
  {
    path: "/account/password/forgot/email",
    name: "forgotPasswordEmail",
    component: PasswordForgotEmailView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
