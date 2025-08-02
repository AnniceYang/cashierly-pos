<template>
  <!-- 用 AuthLayout 包裹 -->
  <AuthLayout>
    <el-card class="auth-card">
      <h2>{{ t("forgotPasswordTitle") }}</h2>
      <el-form :model="form" label-position="top">
        <el-form-item :label="t('username')">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="resetPassword">
            {{ t("resetPassword") }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="extra-link">
        <router-link to="/login">{{ t("backToLogin") }}</router-link>
      </div>
    </el-card>
  </AuthLayout>
</template>

<script setup>
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import AuthLayout from "@/components/AuthLayout.vue"; // 引入 AuthLayout

const { t } = useI18n();

const form = reactive({
  username: "",
});

function resetPassword() {
  alert("忘记密码功能暂未开放");
}
</script>

<style scoped>
.extra-link {
  margin-top: 10px;
  text-align: center;
}
</style>
