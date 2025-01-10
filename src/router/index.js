import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TaskListView from "../views/TaskListView.vue";
import TaskAddView from "../views/TaskAddView.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
