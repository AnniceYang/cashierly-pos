<template>
  <div class="sidebar">
    <h2 class="logo">Cashierly</h2>
    <ul class="menu">
      <li
        v-for="item in menu"
        :key="item.key"
        :class="{ active: activeKey === item.key }"
        @click="handleClick(item.key)"
      >
        <!-- 如果用 Vue Router，可以改成 router-link -->
        <a href="#" @click.prevent>{{ t(item.label) }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const activeKey = ref("dashboard");

const menu = [
  { key: "dashboard", label: "menu.dashboard" },
  { key: "orders", label: "menu.orders" },
  { key: "products", label: "menu.products" },
  { key: "customers", label: "menu.customers" },
  { key: "settings", label: "menu.settings" },
];

function handleClick(key) {
  activeKey.value = key;
  // TODO: 这里可以做页面跳转逻辑，比如使用 router.push 或其他
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #111827;
  color: white;
  padding: 24px;
  height: 100vh;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  margin: 0; /* 确保无边距 */
  user-select: none;
}

.logo {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 32px;
  color: #ec4899;
  user-select: none;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.menu li {
  font-size: 1rem;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;
  user-select: none;
}

.menu li:hover {
  background-color: #2d3748;
  color: #ec4899;
}

.menu li.active {
  background-color: #ec4899;
  color: white;
  font-weight: 600;
}

.menu li a {
  color: inherit;
  text-decoration: none;
  display: block;
  width: 100%;
}
</style>
