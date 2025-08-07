<template>
  <div>
    <!-- 手机端显示的汉堡按钮 -->
    <button class="hamburger" @click="toggleSidebar" aria-label="Toggle Menu">
      &#9776;
    </button>

    <!-- 侧边栏 -->
    <div :class="['sidebar', { open: sidebarOpen }]">
      <div class="sidebar-header">
        <h2 class="logo">Cashierly</h2>

        <ul v-if="userMenuOpen" class="dropdown-menu" @mousedown.prevent>
          <li><a href="#" @click.prevent>Profile</a></li>
          <li><a href="#" @click.prevent>Settings</a></li>
          <li><a href="#" @click.prevent>Logout</a></li>
        </ul>
      </div>

      <!-- ✅ 菜单应该放在 sidebar 内部 -->
      <ul class="menu">
        <li
          v-for="item in menu"
          :key="item.key"
          :class="{ active: activeKey === item.key }"
          @click="handleClick(item)"
        >
          <a href="#" @click.prevent>
            <component :is="item.icon" class="menu-icon" />
            {{ t(item.label) }}
          </a>
        </li>
      </ul>
    </div>

    <!-- 遮罩层 -->
    <div v-if="sidebarOpen" class="overlay" @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  Users,
  Settings,
} from "lucide-vue-next";

const { t } = useI18n();
const router = useRouter();

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
/* 基础侧边栏样式，桌面端保持原样 */
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
  position: fixed; /* 方便手机端动画 */
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
  z-index: 1000;
}

/* logo 和头像部分 */
.sidebar-header {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  user-select: none;
}

/* logo */
.logo {
  font-size: 1.6rem;
  font-weight: bold;
  color: #ec4899;
}

/* 用户菜单 */
.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  outline: none;
  user-select: none;
}

.user-menu:focus-visible {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ec4899;
}

.username {
  font-weight: 600;
  color: #ec4899;
  user-select: text;
  white-space: nowrap;
}

/* 下拉箭头 */
.arrow {
  color: #ec4899;
  transition: transform 0.3s;
  user-select: none;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: 48px;
  left: 0;
  background-color: #1f2937;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 140px;
  padding: 8px 0;
  z-index: 1100;
  user-select: none;
}

.dropdown-menu li {
  list-style: none;
}

.dropdown-menu li a {
  display: block;
  padding: 8px 16px;
  color: #eee;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.dropdown-menu li a:hover {
  background-color: #ec4899;
  color: white;
  border-radius: 4px;
}

/* 菜单 */
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
  display: flex;
  align-items: center;
}

/* 图标和文字间距 */
.menu-icon {
  margin-right: 10px;
  font-size: 1.2rem;
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

/* 汉堡按钮 - 手机端显示，桌面端隐藏 */
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

.hamburger:focus-visible {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

/* 遮罩层，点击关闭侧边栏 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 900;
}

/* 手机端样式 */
@media (max-width: 768px) {
  /* 显示汉堡按钮 */
  .hamburger {
    display: block;
  }

  /* 侧边栏默认隐藏，左移出屏幕 */
  .sidebar {
    width: 220px;
    height: 100vh;
    transform: translateX(-100%);
  }

  /* 侧边栏打开状态，平移回来 */
  .sidebar.open {
    transform: translateX(0);
  }
}

/* 桌面端正常展示 */
@media (min-width: 769px) {
  .sidebar {
    position: relative;
    transform: none !important;
    height: 100vh;
  }

  /* 隐藏遮罩和汉堡按钮 */
  .overlay,
  .hamburger {
    display: none !important;
  }
}
</style>
