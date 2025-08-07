<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { ref, provide } from "vue";

const isDark = ref(false);
provide("isDark", isDark);

onMounted(() => {
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  console.log("✅ 全局 body 样式重置完成");
});
</script>
