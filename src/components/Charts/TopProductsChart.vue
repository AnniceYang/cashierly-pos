<template>
  <BaseChart :title="t('charts.topProductsTitle')" :options="options" />
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseChart from "./BaseChart.vue";

const { t } = useI18n();

const options = computed(() => ({
  title: {
    text: t("charts.topProductsTitle"),
    left: "center",
    textStyle: { color: "var(--color-text)" },
  },
  tooltip: {},
  xAxis: {
    type: "category",
    data: ["iPad", "MacBook", "Mouse", "Keyboard", "Charger"],
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
      name: t("charts.sales"),
      type: "bar",
      data: [250, 200, 180, 160, 120],
      itemStyle: { color: "#10b981" },
      barWidth: "40%",
    },
  ],
  grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
}));
</script>
