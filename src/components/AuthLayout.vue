<template>
  <div class="auth-wrapper">
    <!-- 右上角语言切换 -->
    <div class="lang-switch">
      <el-select v-model="lang" size="small" style="width: 100px">
        <el-option label="中文" value="zh" />
        <el-option label="English" value="en" />
      </el-select>
    </div>

    <!-- 左侧品牌与 Slogan -->
    <div class="left-panel">
      <div class="brand">
        <h1>{{ t("title") }}</h1>
        <p>{{ t("slogan") }}</p>
      </div>
    </div>

    <!-- 右侧内容插槽 -->
    <div class="right-panel">
      <slot />
    </div>

    <!-- 底部版权 -->
    <div class="footer">
      © 2025 Annice-Cashierly POS. All rights reserved. v1.0.0
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t, locale } = useI18n();

// 语言切换用 computed 绑定，确保 v-model 正常工作
const lang = computed({
  get: () => locale.value,
  set: (val) => {
    locale.value = val;
  },
});
</script>

<style scoped>
/* 整体容器：全屏+渐变背景 */
.auth-wrapper {
  position: fixed; /* 用 fixed 保证直接覆盖整个视口 */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
  background: linear-gradient(-45deg, #ff6ec4, #7873f5, #4ade80, #feb692);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 右上角语言切换 */
.lang-switch {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

/* 左半边：品牌区 */
.left-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  background: rgba(0, 0, 0, 0.3); /* 半透明黑色遮罩 */
}

.brand h1 {
  font-size: 44px;
  font-weight: 800;
  margin-bottom: 16px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.brand p {
  font-size: 20px;
  max-width: 320px;
  line-height: 1.5;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  flex: 0.9;
}

/* 右边内容区 */
.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  overflow: auto;
  box-sizing: border-box;
  width: 100%;
}

/* 卡片样式（vue3推荐用:deep()） */
.right-panel :deep(.el-card) {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
}

/* 底部版权信息 */
.footer {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* 让左右布局在手机端改成上下布局 */
/* === 手机适配 === */
@media (max-width: 768px) {
  .auth-wrapper {
    flex-direction: column;
    overflow-x: hidden; /* 防止横向滚动 */
  }

  .left-panel {
    flex: none;
    height: 35%;
    padding: 1rem;
  }

  .right-panel {
    flex: 1;
    width: 100%;
    padding: 1rem;
    box-shadow: none;
  }

  .right-panel :deep(.el-card) {
    max-width: 100%;
  }
}
</style>
