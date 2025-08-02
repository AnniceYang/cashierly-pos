<template>
  <div style="padding: 40px; text-align: center">
    <h1>{{ t("welcome") }}</h1>
    <p>{{ t("dashboardDesc") }}</p>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
