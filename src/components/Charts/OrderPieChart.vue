<template>
  <BaseChart :title="t('charts.orderStatusPieTitle')" :options="options" />
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseChart from "./BaseChart.vue";

const { t } = useI18n();

const options = computed(() => ({
  tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
  legend: {
    bottom: 10,
    textStyle: { color: "var(--color-text)" },
  },
  series: [
    {
      name: t("charts.orders"),
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: "outside", // 可以改为 "outer" 或 "outer" + 更短 labelLine
        formatter: "{b}\n{d}%",
        color: "var(--color-text)",
        fontWeight: "600",
        overflow: "truncate", // 避免 label 太长被挤
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: true,
        length: 10, // 缩短连线长度
        length2: 5,
        smooth: true,
      },
      data: [
        { value: 1048, name: t("order.status.completed") },
        { value: 735, name: t("order.status.pending") },
        { value: 580, name: t("order.status.cancelled") },
      ],
      itemStyle: {
        borderColor: "var(--color-bg)",
        borderWidth: 2,
      },
    },
  ],
}));
</script>
