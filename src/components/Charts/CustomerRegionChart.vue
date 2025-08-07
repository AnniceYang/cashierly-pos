<template>
  <BaseChart :title="t('charts.customerRegionTitle')" :options="options" />
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseChart from "./BaseChart.vue";

const { t } = useI18n();

const options = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
  },
  xAxis: {
    type: "category",
    data: ["North America", "Europe", "Asia", "South America", "Africa"],
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
      data: [120, 90, 150, 40, 20],
      type: "bar",
      itemStyle: { color: "#60a5fa" },
      barWidth: "40%",
    },
  ],
  grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
}));
</script>
