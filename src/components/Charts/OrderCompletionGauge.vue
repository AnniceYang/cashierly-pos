<template>
  <BaseChart :title="t('dashboard.orderCompletionRate')" :options="options" />
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseChart from "./BaseChart.vue";

const { t } = useI18n();

const completionRate = 72;

const options = computed(() => ({
  tooltip: { formatter: `{a}<br/>{b} : {c}%` },
  series: [
    {
      name: t("dashboard.completionRateLabel"),
      type: "gauge",
      detail: {
        formatter: "{value}%",
        color: "var(--color-text)",
        fontSize: 20,
        fontWeight: "bold",
      },
      axisLine: {
        lineStyle: {
          width: 15,
          color: [
            [0.3, "#ff4d4f"],
            [0.7, "#faad14"],
            [1, "#52c41a"],
          ],
        },
      },
      pointer: { itemStyle: { color: "#ec4899" } },
      axisTick: { length: 8, lineStyle: { color: "auto" } },
      splitLine: { length: 15, lineStyle: { color: "auto" } },
      data: [{ value: completionRate, name: t("dashboard.completion") }],
    },
  ],
}));
</script>
