import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Register from "@/views/Register.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import Orders from "@/views/Orders.vue";
import Products from "@/views/Products.vue";
import Customers from "@/views/Customers.vue";
import Settings from "@/views/Settings.vue";
import Search from "@/views/Search.vue";

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
    component: Search,
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
  },
  {
    path: "/customers",
    name: "Customers",
    component: Customers,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
