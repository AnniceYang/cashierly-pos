<template>
  <div class="chart-card">
    <div class="chart-header">
      <h1 class="chart-title">{{ title }}</h1>
      <!-- <button @click="downloadImage" title="导出图片">📸</button> -->
    </div>
    <v-chart
      ref="chartRef"
      :option="computedOptions"
      autoresize
      @click="onClick"
      class="chart-container"
    />
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted } from "vue";
import VChart from "vue-echarts";

const props = defineProps({
  title: String,
  options: Object,
  onClick: Function,
});

const chartRef = ref(null);
const isDark = inject("isDark");

// 统一深浅主题下的颜色逻辑
const computedOptions = computed(() => {
  const textColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-text")
      .trim() || "#ccc";

  const borderColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-border")
      .trim() || "#555";

  const base = {
    ...props.options,
    textStyle: {
      color: textColor,
    },
    tooltip: {
      ...props.options?.tooltip,
      backgroundColor: isDark?.value ? "#2c2c3c" : "#fff",
      textStyle: {
        color: textColor,
      },
    },
  };

  // 判断是否有 xAxis/yAxis 类型的图
  const hasAxis =
    props.options?.xAxis !== undefined ||
    props.options?.yAxis !== undefined ||
    ["line", "bar"].includes(props.options?.series?.[0]?.type || "");

  if (hasAxis) {
    base.xAxis = {
      ...props.options?.xAxis,
      axisLine: {
        lineStyle: { color: textColor },
      },
      axisLabel: {
        color: textColor,
      },
      splitLine: {
        lineStyle: { color: borderColor },
      },
    };

    base.yAxis = {
      ...props.options?.yAxis,
      axisLine: {
        lineStyle: { color: textColor },
      },
      axisLabel: {
        color: textColor,
      },
      splitLine: {
        lineStyle: { color: borderColor },
      },
    };
  }

  return base;
});

function downloadImage() {
  const chart = chartRef.value?.getEchartsInstance?.();
  if (!chart) {
    console.warn("ECharts instance not ready.");
    return;
  }
  const url = chart.getDataURL({
    type: "png",
    pixelRatio: 2,
    backgroundColor: isDark?.value ? "#1e1e2f" : "#fff",
  });

  const link = document.createElement("a");
  link.href = url;
  link.download = `${props.title || "chart"}.png`;
  link.click();
}
</script>

<style scoped>
.chart-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px var(--color-shadow);
  display: flex;
  flex-direction: column;
  min-height: 360px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: var(--color-text);
}

.chart-title {
  font-size: 1.25rem; /* 20px */
  font-weight: 700; /* 更粗 */
  line-height: 1.3;
  margin: 0;
  max-width: 90%;
  word-break: break-word;
  color: var(--color-text);
}

.chart-header button {
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 18px;
  color: var(--color-text);
  transition: color 0.2s ease;
}
.chart-header button:hover {
  color: #ec4899;
}

.chart-container {
  flex-grow: 1;
  width: 100%;
  height: auto;
  min-height: 300px;
}
</style>
