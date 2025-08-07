<template>
  <BaseChart :title="t('charts.salesTrendTitle')" :options="options" />
</template>

<script setup>
import { computed, ref, inject } from "vue";
import { useI18n } from "vue-i18n";
import BaseChart from "./BaseChart.vue";

const { t } = useI18n();
const range = ref("month");
const isDark = inject("isDark");

const salesData = {
  day: [150, 200, 180, 220, 170, 190, 210],
  month: [3000, 4200, 5100, 6100, 4800, 7000],
  year: [35000, 42000, 49000, 53000, 58000, 62000],
};

const options = computed(() => {
  let data = salesData[range.value];
  let categories =
    range.value === "day"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : range.value === "month"
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      : ["2019", "2020", "2021", "2022", "2023", "2024"];

  return {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: categories,
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
        type: "line",
        smooth: true,
        data,
        lineStyle: { width: 3, color: "#ec4899" },
        itemStyle: { color: "#ec4899" },
      },
    ],
    grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
  };
});
</script>
