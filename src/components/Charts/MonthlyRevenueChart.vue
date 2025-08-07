<template>
  <BaseChart :title="t('charts.monthlyRevenueTitle')" :options="options" />
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseChart from "./BaseChart.vue";

const { t } = useI18n();

const options = computed(() => ({
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    axisLine: { lineStyle: { color: "var(--color-text)" } },
    axisLabel: { color: "var(--color-text)" },
  },
  yAxis: {
    type: "value",
    axisLine: { lineStyle: { color: "var(--color-text)" } },
    axisLabel: { color: "var(--color-text)" },
    splitLine: { lineStyle: { color: "var(--color-border)" } },
  },
  series: [
    {
      name: t("charts.revenue"),
      type: "line",
      data: [3000, 4200, 5100, 6100, 4800, 7000],
      smooth: true,
      lineStyle: { width: 3, color: "#2563eb" },
      itemStyle: { color: "#2563eb" },
    },
  ],
  grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
}));
</script>
