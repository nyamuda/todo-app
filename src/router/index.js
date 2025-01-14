import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TaskListView from "../views/Tasks/TaskListView.vue";
import TaskAddView from "../views/Tasks/TaskAddView.vue";
import LoginView from "@/views/Account/LoginView.vue";
import EmailVerificationView from "@/views/Account/EmailVerificationView.vue";
import RegisterView from "@/views/Account/RegisterView.vue";
import EmailVerificationResult from "@/components/Account/EmailVerificationResult.vue";

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
    component: EmailVerificationResult,
  },
  {
    path: "/account/register",
    name: "register",
    component: RegisterView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
