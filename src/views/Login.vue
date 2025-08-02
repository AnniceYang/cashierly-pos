<template>
  <AuthLayout>
    <el-card class="login-card">
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item :label="t('username')" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item :label="t('password')" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            :loading="loading"
            @click="submitForm"
          >
            {{ t("login") }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="links">
        <a @click="mockForgotPassword">{{ t("forgotPassword") }}</a>
        <a @click="mockRegister">{{ t("register") }}</a>
      </div>
    </el-card>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import axios from "axios";
import { ElMessage } from "element-plus";
import AuthLayout from "@/components/AuthLayout.vue";

const { t } = useI18n();
const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});

const loading = ref(false);
const formRef = ref();

const rules = computed(() => ({
  username: [{ required: true, message: t("requiredUser"), trigger: "blur" }],
  password: [{ required: true, message: t("requiredPass"), trigger: "blur" }],
}));

function submitForm() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const res = await axios.post("/api/login", {
          username: form.username,
          password: form.password,
        });

        if (res.data.code === 200) {
          localStorage.setItem("token", res.data.data.token);
          ElMessage.success(t("loginSuccess"));
          router.push("/dashboard");
        } else {
          ElMessage.error(t("loginFail"));
        }
      } catch (err) {
        ElMessage.error(t("networkError"));
      } finally {
        loading.value = false;
      }
    }
  });
}

function mockRegister() {
  router.push("/register");
}

function mockForgotPassword() {
  router.push("/forgot-password");
}
</script>

<style scoped>
.links {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
}
.links a {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
}
</style>
