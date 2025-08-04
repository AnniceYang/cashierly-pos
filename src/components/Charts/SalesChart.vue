<template>
  <div ref="chartRef" style="width: 100%; height: 300px" />
</template>

<script setup>
import * as echarts from "echarts";
import { onMounted, ref } from "vue";

const chartRef = ref(null);

onMounted(() => {
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    title: { text: "Sales Trend", left: "center" },
    tooltip: {},
    xAxis: { data: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    yAxis: {},
    series: [{ name: "Sales", type: "line", data: [120, 200, 150, 80, 70] }],
  });
});
</script>
