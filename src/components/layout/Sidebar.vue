<template>
  <div>
    <!-- 优化后的汉堡按钮 -->
    <button class="hamburger" @click="toggleSidebar" aria-label="Toggle Menu">
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
    </button>

    <!-- 侧边栏 -->
    <div :class="['sidebar', { open: sidebarOpen }]">
      <div class="sidebar-header">
        <h2 class="logo">Cashierly</h2>
        <p class="slogan">{{ t("slogan") }}</p>
      </div>
      <!-- 菜单 -->
      <ul class="menu">
        <li
          v-for="item in menu"
          :key="item.key"
          :class="{ active: activeKey === item.key }"
          @click="handleClick(item)"
        >
          <a href="#" @click.prevent class="menu-item">
            <component :is="item.icon" class="menu-icon" />
            <span class="menu-label">{{ t(item.label) }}</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- 遮罩层 -->
    <div v-if="sidebarOpen" class="overlay" @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  Users,
  Settings,
} from "lucide-vue-next";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const activeKey = ref("");
const sidebarOpen = ref(false);
const userMenuOpen = ref(false);

// ✅ 添加 path 对应项
const menu = [
  {
    key: "dashboard",
    label: "menu.dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  { key: "orders", label: "menu.orders", path: "/orders", icon: ShoppingCart },
  { key: "products", label: "menu.products", path: "/products", icon: Box },
  {
    key: "customers",
    label: "menu.customers",
    path: "/customers",
    icon: Users,
  },
  {
    key: "settings",
    label: "menu.settings",
    path: "/settings",
    icon: Settings,
  },
];

// 使用路由的 path 来设置 activeKey
const setActiveKey = () => {
  const matchingItem = menu.find((item) => item.path === route.path);
  if (matchingItem) {
    activeKey.value = matchingItem.key;
  }
};

// 初始化时设置 activeKey
setActiveKey();

// 监听路由变化
watch(() => route.path, setActiveKey);

function handleClick(item) {
  activeKey.value = item.key;
  sidebarOpen.value = false;
  userMenuOpen.value = false;
  router.push(item.path);
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value;
}
</script>

<style scoped>
/* 基础侧边栏样式 - 保持原有颜色 */
.sidebar {
  width: 240px; /* 稍微加宽 */
  background-color: #111827;
  color: white;
  padding: 20px 0; /* 修改为上下padding */
  height: 100vh;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
  z-index: 1000;
}

/* logo 部分 - 增加间距 */
.sidebar-header {
  padding: 0 24px 20px 24px;
  margin-bottom: 12px;
  border-bottom: 1px solid #2d3748;
}

.logo {
  font-size: 1.6rem;
  font-weight: bold;
  color: #ec4899;
  margin: 0;
  padding: 12px 0 4px 0; /* 调整垂直padding */
}

.slogan {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 4px 0 0 0;
  font-weight: 400;
  opacity: 0.9;
}

/* 菜单项优化 */
.menu {
  list-style: none;
  padding: 0 16px; /* 两侧内边距 */
  margin: 0;
  flex-grow: 1;
}

.menu li {
  margin-bottom: 4px; /* 增加菜单项间距 */
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #e2e8f0;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.menu-icon {
  margin-right: 12px;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  color: #94a3b8;
}

.menu-label {
  font-size: 0.95rem;
  font-weight: 500;
}

.menu li:hover .menu-item {
  background-color: #2d3748;
  color: #ec4899;
}

.menu li:hover .menu-icon {
  color: #ec4899;
}

.menu li.active .menu-item {
  background-color: #ec4899;
  color: white;
}

.menu li.active .menu-icon {
  color: white;
}

/* 优化汉堡按钮 */
.hamburger {
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  z-index: 1100;
  flex-direction: column;
  justify-content: space-between;
  height: 24px;
  width: 30px;
}

.hamburger-bar {
  display: block;
  height: 2px;
  width: 100%;
  background-color: #ec4899;
  transition: all 0.3s ease;
}

.hamburger:focus-visible {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

/* 遮罩层优化 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 900;
  backdrop-filter: blur(2px); /* 添加模糊效果 */
}

/* 手机端样式优化 */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    position: fixed;
    z-index: 1000;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .hamburger {
    display: flex;
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1100;
  }

  .overlay {
    display: block;
  }
}

/* 桌面端样式 */
@media (min-width: 769px) {
  .sidebar {
    position: relative;
    transform: none !important;
  }

  .overlay,
  .hamburger {
    display: none !important;
  }
}
</style>
