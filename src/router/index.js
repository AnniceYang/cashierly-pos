import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Register from "@/views/Register.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";

const routes = [
  {
    path: "/",
    redirect: "/login", // 访问 / 直接重定向到 /login
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("@/views/Search.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
