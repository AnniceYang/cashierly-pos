<template>
  <div class="topbar">
    <div class="spacer"></div>
    <div class="actions">
      <!-- PC端显示搜索框 -->
      <el-input
        v-if="!isMobile"
        v-model="searchText"
        :placeholder="t('topbar.searchPlaceholder')"
        size="small"
        clearable
        @keyup.enter.native="handleSearch"
        class="search-input"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template>
      </el-input>

      <!-- 手机端显示放大镜图标 -->
      <span
        v-if="isMobile"
        class="icon-btn"
        @click="showMobileSearch = true"
        aria-label="Search"
        role="button"
        tabindex="0"
      >
        🔍
      </span>

      <!-- 语言切换下拉 -->
      <el-dropdown trigger="click" @command="changeLang">
        <span class="icon-btn" tabindex="0" aria-haspopup="true"> 🌐 </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="en">English</el-dropdown-item>
            <el-dropdown-item command="zh">中文</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 主题切换 -->
      <span
        class="icon-btn"
        @click="toggleDark"
        tabindex="0"
        role="button"
        aria-pressed="false"
      >
        {{ isDark ? "🌞" : "🌙" }}
      </span>

      <!-- 用户头像下拉 -->
      <el-dropdown @command="handleCommand">
        <template #default>
          <div class="avatar" tabindex="0" aria-haspopup="true">👤</div>
        </template>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">{{
              t("topbar.profile")
            }}</el-dropdown-item>
            <el-dropdown-item divided command="logout">{{
              t("topbar.logout")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 手机端弹出搜索框模态 -->
    <el-dialog
      v-model="showMobileSearch"
      width="90%"
      top="20vh"
      :close-on-click-modal="true"
      custom-class="mobile-search-dialog"
    >
      <div class="mobile-search-wrapper">
        <el-input
          v-model="searchText"
          :placeholder="t('topbar.searchPlaceholder')"
          size="large"
          clearable
          @keyup.enter.native="handleSearchInMobile"
          class="mobile-search-input"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearchInMobile" />
          </template>
        </el-input>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";

const { locale, t } = useI18n();
const router = useRouter();

const searchText = ref("");
const showMobileSearch = ref(false);
const isDark = inject("isDark");

const isMobile = ref(window.innerWidth <= 600);
function updateIsMobile() {
  isMobile.value = window.innerWidth <= 600;
}

onMounted(() => {
  window.addEventListener("resize", updateIsMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateIsMobile);
});

function toggleDark() {
  isDark.value = !isDark.value;
  const htmlEl = document.documentElement;
  if (isDark.value) {
    htmlEl.classList.add("dark");
  } else {
    htmlEl.classList.remove("dark");
  }
}

function changeLang(lang) {
  locale.value = lang;
}

function handleCommand(command) {
  if (command === "logout") {
    ElMessageBox.confirm(t("topbar.confirmLogout"), t("topbar.logoutTitle"), {
      confirmButtonText: t("topbar.confirm"),
      cancelButtonText: t("topbar.cancel"),
      type: "warning",
    }).then(() => {
      ElMessage.success(t("topbar.logoutSuccess"));
      router.push("/login");
    });
  } else if (command === "profile") {
    ElMessage.info(t("topbar.profileMsg"));
  }
}

function handleSearch() {
  if (!searchText.value.trim()) return;
  router.push({ path: "/search", query: { keyword: searchText.value.trim() } });
}

function handleSearchInMobile() {
  if (!searchText.value.trim()) {
    ElMessage.info(t("topbar.pleaseEnterKeyword"));
    return;
  }
  showMobileSearch.value = false; // 关闭弹窗
  router.push({ path: "/search", query: { keyword: searchText.value.trim() } });
}
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: var(--color-bg);
  padding: 10px 20px;
  box-shadow: 0 2px 8px var(--color-shadow);
  color: var(--color-text);
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.icon-btn {
  font-size: 18px;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background-color 0.2s;
  color: var(--color-text);
}
.icon-btn:hover,
.icon-btn:focus-visible {
  background-color: rgba(122, 169, 255, 0.15);
  outline: none;
}

/* PC端搜索框美化 */
.search-input {
  width: 240px;
  --el-input-bg-color: transparent;
  --el-input-border-radius: 10px;
  --el-input-border-color: var(--el-border-color);
  --el-input-hover-border-color: #409eff;
  --el-input-focus-border-color: #409eff;
  --el-input-placeholder-color: #999;
  --el-input-inner-height: 32px;
  transition: box-shadow 0.3s;
}

.search-input :deep(.el-input-group__append) {
  background-color: #409eff;
  border-radius: 0 10px 10px 0;
  color: white;
  font-weight: bold;
}

/* 头像 */
.avatar {
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.dark .avatar {
  background: #444;
  color: #fff;
}

/* 手机端弹窗整体样式 */
.mobile-search-dialog .el-dialog__body {
  padding: 0;
  background: linear-gradient(145deg, #f4f7fa, #e1e7ef);
  border-radius: 20px;
}
.dark .mobile-search-dialog .el-dialog__body {
  background: linear-gradient(145deg, #2c2f34, #1e1f21);
}

/* 外部包裹器：居中 + 留白 */
.mobile-search-wrapper {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 移动端搜索框 */
.mobile-search-input {
  border-radius: 12px;
  padding: 4px 8px;
}
.mobile-search-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: white;
}
.mobile-search-input :deep(.el-input__inner:focus) {
  border-color: #409eff;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.4);
}
.mobile-search-input :deep(.el-input-group__append) {
  background-color: #409eff;
  border-radius: 0 12px 12px 0;
  color: white;
}
.mobile-search-input :deep(.el-input-group__append:hover) {
  background-color: #66b1ff;
}
</style>
