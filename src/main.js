import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./style.css";

import App from "./App.vue";
import router from "./router";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

import "echarts/theme/dark"; // 视情况而定

// 1. 导入 echarts 核心和组件
import * as echarts from "echarts/core";

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";

import { LineChart, BarChart, PieChart, GaugeChart } from "echarts/charts";

import { CanvasRenderer } from "echarts/renderers";

// 2. 注册 echarts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
  CanvasRenderer,
]);

const app = createApp(App);

const i18n = createI18n({
  legacy: false,
  locale: "zh", // 默认语言
  fallbackLocale: "en",
  messages: { en, zh },
});

app.use(router);
app.use(createPinia());
app.use(ElementPlus);
app.use(i18n);

// 3. 把 echarts 挂载到全局（可选，方便其它组件直接用）
app.config.globalProperties.$echarts = echarts;

app.mount("#app");
