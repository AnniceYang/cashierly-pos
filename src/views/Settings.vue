<template>
  <div class="dashboard-layout">
    <!-- 侧边栏 -->
    <Sidebar />
    <div class="dashboard-main">
      <!-- 顶部导航栏 -->
      <Topbar />

      <div class="dashboard-content">
        <!-- 页面标题 -->
        <h1 class="dashboard-title">{{ t("settings.title") }}</h1>

        <!-- 栅格布局：宽屏两列，窄屏堆叠 -->
        <div class="settings-grid">
          <!-- 账号信息卡片 -->
          <div class="settings-card">
            <h2 class="section-title">{{ t("settings.account") }}</h2>
            <div class="form-grid">
              <div class="form-item">
                <label for="username">{{ t("settings.username") }}</label>
                <input
                  id="username"
                  type="text"
                  v-model="username"
                  disabled
                  aria-readonly="true"
                />
              </div>
              <div class="form-item">
                <label for="email">{{ t("settings.email") }}</label>
                <input
                  id="email"
                  type="text"
                  v-model="email"
                  disabled
                  aria-readonly="true"
                />
              </div>
            </div>
            <div class="card-actions">
              <button class="primary-btn" @click="handleChangePassword">
                {{ t("settings.changePassword") }}
              </button>
            </div>
          </div>

          <!-- 偏好设置卡片 -->
          <div class="settings-card">
            <h2 class="section-title">{{ t("settings.preferences") }}</h2>
            <div class="form-grid">
              <div class="form-item">
                <label for="langSelect">{{ t("settings.language") }}</label>
                <select id="langSelect" v-model="currentLocale">
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
              </div>
              <div class="form-item">
                <label>{{ t("settings.theme") }}</label>
                <button class="secondary-btn" @click="toggleTheme">
                  {{
                    theme === "dark" ? t("settings.dark") : t("settings.light")
                  }}
                </button>
              </div>
            </div>
            <p class="muted">更改内容会保存在本地(localStorage)，仅用于演示</p>
          </div>
        </div>

        <!-- 危险操作卡片 -->
        <div class="settings-card danger-zone">
          <h2 class="section-title">{{ t("settings.security") }}</h2>
          <div class="danger-actions">
            <button class="danger-btn" @click="handleLogout">
              {{ t("settings.logout") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Sidebar from "@/components/layout/Sidebar.vue";
import Topbar from "@/components/layout/Topbar.vue";

const { t, locale } = useI18n();
const router = useRouter();

const username = ref("Demo User");
const email = ref("demo@example.com");

// 语言绑定 i18n
const currentLocale = computed({
  get: () => locale.value,
  set: (val) => {
    locale.value = val;
    localStorage.setItem("cashierly-locale", val);
    alert(t("settings.langChanged"));
  },
});

// 主题切换
const theme = ref(localStorage.getItem("cashierly-theme") || "light");
function applyThemeToHtml() {
  document.documentElement.classList.toggle("dark", theme.value === "dark");
}
function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem("cashierly-theme", theme.value);
  applyThemeToHtml();
}
onMounted(() => {
  const savedLocale = localStorage.getItem("cashierly-locale");
  if (savedLocale) locale.value = savedLocale;
  applyThemeToHtml();
});

// 操作：修改密码 / 退出登录
function handleChangePassword() {
  const val = window.prompt(t("settings.newPassword"), "");
  if (val && val.trim()) alert(t("settings.passwordChanged"));
}
function handleLogout() {
  const ok = window.confirm(t("settings.confirmLogout"));
  if (!ok) return;
  alert(t("settings.logoutSuccess"));
  router.push("/login");
}
</script>

<style scoped>
/* ---------------- 基础布局 ---------------- */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}

.dashboard-content {
  padding: 32px;
  flex: 1;
  background-color: transparent;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 28px;
  color: var(--color-text);
}

/* ---------------- 栅格布局 ---------------- */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 24px;
}
@media (min-width: 900px) {
  .settings-grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

/* ---------------- 卡片 ---------------- */
.settings-card {
  background-color: var(--color-card-bg); /* 使用全局变量，深色模式自动生效 */
  color: var(--color-text);
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 4px 12px var(--color-shadow);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.settings-card:hover {
  box-shadow: 0 6px 16px var(--color-shadow);
}

.section-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-text);
}

/* ---------------- 表单 ---------------- */
.form-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 240px;
}

.form-item label {
  font-size: 0.9rem;
  margin-bottom: 6px;
  color: var(--color-text-secondary, #666);
  user-select: none;
}

.form-item input,
.form-item select {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg);
  color: var(--color-text);
  transition: all 0.2s;
}

.form-item input:focus,
.form-item select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

/* 小提示文字 */
.muted {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #999);
  margin-top: 6px;
}

/* ---------------- 操作按钮 ---------------- */
.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.primary-btn {
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.primary-btn:hover {
  background: var(--color-primary-hover);
}

.secondary-btn {
  background: var(--color-border);
  color: var(--color-text);
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.secondary-btn:hover {
  background: var(--color-shadow);
}

/* ---------------- 危险操作 ---------------- */
.danger-zone {
  border: 1px solid var(--color-error);
  margin-top: 16px;
}
.danger-actions {
  display: flex;
  gap: 12px;
}
.danger-btn {
  background: var(--color-error);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.danger-btn:hover {
  background: #e64545;
}

/* ---------------- 响应式 ---------------- */
@media (max-width: 640px) {
  .form-grid {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn,
  .danger-btn {
    width: 100%;
  }

  .dashboard-content {
    padding: 16px;
  }
}
</style>
