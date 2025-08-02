<template>
  <div class="login-wrapper">
    <!-- 左侧介绍 -->
    <div class="left-panel">
      <h1>{{ t("title") }}</h1>
      <p>{{ t("slogan") }}</p>
      <div class="lang-switch">
        <el-button size="small" @click="setLang('zh')">中文</el-button>
        <el-button size="small" @click="setLang('en')">English</el-button>
      </div>
    </div>

    <!-- 右侧登录卡片 -->
    <div class="right-panel">
      <el-card class="login-card">
        <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-position="top"
        >
          <el-form-item :label="t('username')" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item :label="t('password')" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="submitForm">{{
              t("login")
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t, locale } = useI18n();
const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});

const formRef = ref();

const rules = {
  username: [{ required: true, message: t("requiredUser"), trigger: "blur" }],
  password: [{ required: true, message: t("requiredPass"), trigger: "blur" }],
};

function setLang(lang) {
  locale.value = lang;
}

function submitForm() {
  formRef.value.validate((valid) => {
    if (valid) {
      alert("登录成功");
      router.push("/dashboard");
    }
  });
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  height: 100vh;
}
.left-panel {
  flex: 1;
  background: linear-gradient(135deg, #ffdee9, #b5fffc);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #333;
}
.left-panel h1 {
  font-size: 32px;
  font-weight: bold;
}
.left-panel p {
  font-size: 18px;
  margin: 10px 0 20px;
}
.lang-switch {
  display: flex;
  gap: 10px;
}
.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
}
.login-card {
  width: 360px;
}
</style>
