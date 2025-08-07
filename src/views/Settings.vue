<template>
  <div class="page">
    <h1>{{ t("menu.orders") }}</h1>
    <p>这里是设置页面</p>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<style scoped>
.page {
  padding: 2rem;
}
</style>
