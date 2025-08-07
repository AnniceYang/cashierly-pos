<template>
  <div>
    <!-- 手机端显示的汉堡按钮 -->
    <button class="hamburger" @click="toggleSidebar" aria-label="Toggle Menu">
      &#9776;
    </button>

    <!-- 侧边栏 -->
    <div :class="['sidebar', { open: sidebarOpen }]">
      <h2 class="logo">Cashierly</h2>
      <ul class="menu">
        <li
          v-for="item in menu"
          :key="item.key"
          :class="{ active: activeKey === item.key }"
          @click="handleClick(item.key)"
        >
          <a href="#" @click.prevent>
            <span class="menu-icon">📌</span>
            {{ t(item.label) }}
          </a>
        </li>
      </ul>
    </div>

    <!-- 遮罩层，点击遮罩关闭侧边栏 -->
    <div v-if="sidebarOpen" class="overlay" @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const activeKey = ref("dashboard");
const sidebarOpen = ref(false);

const menu = [
  { key: "dashboard", label: "menu.dashboard" },
  { key: "orders", label: "menu.orders" },
  { key: "products", label: "menu.products" },
  { key: "customers", label: "menu.customers" },
  { key: "settings", label: "menu.settings" },
];

function handleClick(key) {
  activeKey.value = key;
  sidebarOpen.value = false; // 点击菜单项后自动关闭侧边栏（手机端）
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
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
  margin: 0;
  user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
  z-index: 1000;
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
  display: flex;
  align-items: center;
  width: 100%;
}

/* 这里加了图标和文字间距 */
.menu-icon {
  margin-right: 10px;
  user-select: none;
  font-size: 1.2rem;
}

/* 汉堡按钮 */
.hamburger {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  background: transparent;
  border: none;
  color: #ec4899;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1100;
  user-select: none;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 900;
}

@media (max-width: 768px) {
  .hamburger {
    display: block;
  }
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
}

@media (min-width: 769px) {
  .sidebar {
    position: relative;
    transform: none !important;
    height: 100vh;
  }
  .overlay,
  .hamburger {
    display: none !important;
  }
}
</style>
