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

const app = createApp(App);

const i18n = createI18n({
  legacy: false,
  locale: "zh", //默认语言
  fallbackLocale: "en",
  messages: { en, zh },
});

app.use(router);
app.use(createPinia());
app.use(ElementPlus);
app.use(i18n);
app.mount("#app");
