<template>
  <div class="topbar">
    <div class="spacer"></div>
    <div class="actions">
      <!-- 搜索输入框 -->
      <el-input
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

      <!-- 切换语言按钮 -->
      <button @click="toggleLang">
        {{ currentLang === "en" ? "EN" : "中" }}
      </button>
      <el-dropdown @command="handleCommand">
        <span class="avatar-dropdown">
          <div class="avatar">👤</div>
        </span>

        <!-- Avatar 下拉菜单 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              {{ t("topbar.profile") }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              {{ t("topbar.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";

const { locale, t } = useI18n();
const currentLang = locale;
const router = useRouter();
const searchText = ref("");

function toggleLang() {
  locale.value = locale.value === "en" ? "zh" : "en";
}

function handleCommand(command) {
  if (command === "logout") {
    ElMessage.success(t("topbar.logoutSuccess"));
    router.push("/login");
  } else if (command === "profile") {
    ElMessage.info(t("topbar.profileMsg"));
  }
}

function handleSearch() {
  if (!searchText.value.trim()) return;
  ElMessage.info(`Search for: ${searchText.value}`);
  // 可以改成 router.push(`/search?keyword=${searchText.value}`) 等操作
}
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: white;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
button {
  border: none;
  background: #ec4899;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.search-input {
  width: 200px;
}

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
</style>
