<template>
  <div class="search-page">
    <el-button type="primary" @click="goBack" size="small">
      {{ t("common.backDashboard") }}
    </el-button>

    <h2>{{ t("search.resultTitle") }}</h2>
    <p v-if="!keyword">{{ t("search.noKeyword") }}</p>
    <p v-else>
      {{ t("search.keyword") }}:
      <strong v-html="highlightKeyword('Fake result for ' + keyword)" />
    </p>
    <!-- 这里可以模拟一些假搜索结果，提升页面丰满度 -->
    <ul v-if="keyword" class="search-results">
      <li
        v-for="item in fakeResults"
        :key="item.id"
        v-html="highlightKeyword(item.text)"
      ></li>
    </ul>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const keyword = route.query.keyword || "";
const { t } = useI18n();

function highlightKeyword(text) {
  if (!keyword) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, `<span class="highlight">$1</span>`);
}

function goBack() {
  router.push("/dashboard");
}

// 模拟假数据
const fakeResults = [
  { id: 1, text: `Order #123 matching keyword ${keyword}` },
  { id: 2, text: `Customer feedback mentioning ${keyword}` },
  { id: 3, text: `Product related to ${keyword}` },
];
</script>

<style scoped>
.search-page {
  padding: 20px;
}
.highlight {
  background-color: #fef08a;
  color: #d97706;
  padding: 0 4px;
  border-radius: 4px;
}
.search-results {
  margin-top: 16px;
  list-style: none;
  padding: 0;
}
.search-results li {
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
}
.search-results li:hover {
  background-color: #f3f4f6;
}
</style>
