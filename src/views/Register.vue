<template>
  <AuthLayout>
    <el-card class="auth-card">
      <h2>{{ t("registerTitle") }}</h2>
      <el-form :model="form" label-position="top">
        <el-form-item :label="t('username')">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item :label="t('password')">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
        <el-form-item :label="t('confirmPassword')">
          <el-input type="password" v-model="form.confirmPassword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="register">
            {{ t("register") }}
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
import AuthLayout from "@/components/AuthLayout.vue"; // 复用刚刚的布局

const { t } = useI18n();

const form = reactive({
  username: "",
  password: "",
  confirmPassword: "",
});

function register() {
  alert("注册功能暂未开放");
}
</script>

<style scoped>
.extra-link {
  margin-top: 10px;
  text-align: center;
}
</style>
