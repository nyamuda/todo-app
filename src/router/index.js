import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TaskListView from "../views/TaskListView.vue";
import TaskAddView from "../views/TaskAddView.vue";
import LoginView from "@/views/LoginView.vue";
import EmailVerificationView from "@/views/EmailVerificationView.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
