<template>
  <div class="dashboard-layout" role="main" aria-label="Dashboard main layout">
    <Sidebar />
    <div
      class="dashboard-main"
      tabindex="0"
      aria-live="polite"
      aria-atomic="true"
    >
      <Topbar />

      <div class="dashboard-content">
        <h1 class="dashboard-title">{{ t("dashboard.title") }}</h1>
        <p class="dashboard-welcome">{{ t("dashboard.welcome") }}</p>

        <section aria-label="Key performance indicators" class="stats-cards">
          <div
            v-for="item in stats"
            :key="item.titleKey"
            class="stat-card"
            tabindex="0"
            role="region"
            :aria-label="t(item.titleKey) + ': ' + item.value"
          >
            <h3>{{ t(item.titleKey) }}</h3>
            <p class="value">{{ item.value }}</p>
          </div>
        </section>

        <section aria-label="Performance charts" class="charts-grid">
          <SalesChart />
          <OrderPieChart />
          <CustomerRegionChart />
          <OrderCompletionGauge />
          <MonthlyRevenueChart />
          <TopProductsChart />
        </section>

        <section aria-label="Recent orders table" class="orders-section">
          <div class="orders-header">
            <h2>{{ t("dashboard.recentOrders") }}</h2>
            <button
              class="export-btn"
              @click="exportCSV"
              aria-label="Export recent orders as CSV"
              title="Export CSV"
            >
              <svg
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5,20H19V18H5V20M19,8H14V3H10V8H5L12,15L19,8Z" />
              </svg>
              {{ t("dashboard.exportCSV") }}
            </button>
          </div>

          <table
            class="orders-table"
            role="table"
            aria-describedby="orders-desc"
          >
            <thead>
              <tr>
                <th scope="col">{{ t("dashboard.table.id") }}</th>
                <th scope="col">{{ t("dashboard.table.customer") }}</th>
                <th scope="col">{{ t("dashboard.table.total") }}</th>
                <th scope="col">{{ t("dashboard.table.status") }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="o in recentOrders" :key="o.id" tabindex="0">
                <td>{{ o.id }}</td>
                <td>{{ o.customer }}</td>
                <td>{{ o.total }}</td>
                <td>
                  <span
                    :class="['status-badge', o.status.toLowerCase()]"
                    :title="
                      t('dashboard.statusTooltip.' + o.status.toLowerCase())
                    "
                    role="note"
                    aria-label="Order status: {{ o.status }}"
                  >
                    {{ o.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <button
          v-show="showBackTop"
          class="back-to-top"
          @click="scrollTop"
          aria-label="Back to top"
          title="Back to top"
        >
          ⬆
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { onMounted, onUnmounted, ref } from "vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import Topbar from "@/components/layout/Topbar.vue";

import SalesChart from "@/components/Charts/SalesChart.vue";
import OrderPieChart from "@/components/Charts/OrderPieChart.vue";
import CustomerRegionChart from "@/components/Charts/CustomerRegionChart.vue";
import OrderCompletionGauge from "@/components/Charts/OrderCompletionGauge.vue";
import TopProductsChart from "@/components/Charts/TopProductsChart.vue";
import MonthlyRevenueChart from "@/components/Charts/MonthlyRevenueChart.vue";

const { t } = useI18n();

const stats = [
  { titleKey: "dashboard.sales", value: "$1,200" },
  { titleKey: "dashboard.orders", value: "32" },
  { titleKey: "dashboard.customers", value: "18" },
  { titleKey: "dashboard.conversionRate", value: "3.8%" },
  { titleKey: "dashboard.avgOrderValue", value: "$45" },
];

const recentOrders = [
  { id: "ORD-001", customer: "Alice", total: "$120", status: "Completed" },
  { id: "ORD-002", customer: "Tom", total: "$90", status: "Pending" },
  { id: "ORD-003", customer: "Charlie", total: "$210", status: "Completed" },
  { id: "ORD-004", customer: "Sophia", total: "$180", status: "Cancelled" },
  { id: "ORD-005", customer: "David", total: "$75", status: "Completed" },
  { id: "ORD-006", customer: "Eva", total: "$310", status: "Pending" },
  { id: "ORD-007", customer: "Michael", total: "$145", status: "Completed" },
  { id: "ORD-008", customer: "Nina", total: "$195", status: "Completed" },
  { id: "ORD-009", customer: "Leo", total: "$130", status: "Pending" },
  { id: "ORD-010", customer: "Grace", total: "$220", status: "Cancelled" },
];

function exportCSV() {
  const headers = [
    t("dashboard.table.id"),
    t("dashboard.table.customer"),
    t("dashboard.table.total"),
    t("dashboard.table.status"),
  ];
  const rows = recentOrders.map((o) => [o.id, o.customer, o.total, o.status]);
  const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "recent-orders.csv");
  link.click();
  URL.revokeObjectURL(url);
}

const showBackTop = ref(false);

function onScroll() {
  const el = document.querySelector(".dashboard-main");
  if (el) {
    showBackTop.value = el.scrollTop > 300;
  }
}

onMounted(() => {
  const el = document.querySelector(".dashboard-main");
  el?.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  const el = document.querySelector(".dashboard-main");
  el?.removeEventListener("scroll", onScroll);
});

function scrollTop() {
  document
    .querySelector(".dashboard-main")
    ?.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-bg);
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.dashboard-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: var(--color-text);
}

.dashboard-content {
  padding: 24px 32px;
  box-sizing: border-box;
  flex: 1;
  position: relative;
  width: 100%; /* 占满dashboard-main宽度 */
  margin: 0; /* 不居中 */
  max-width: none; /* 取消限制 */
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 32px;
  margin-bottom: 48px;
}

@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

/* KPI 卡片 */

.stat-card {
  background: var(--color-card-bg);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px var(--color-shadow);
  border: 1px solid var(--color-border);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  color: var(--color-text);
  cursor: default;
}
.stat-card:hover,
.stat-card:focus {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px var(--color-primary);
  outline: none;
}

.stat-card h3 {
  margin: 0 0 8px 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.stat-card .value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  user-select: text;
}

/* 图表区 */

.charts-grid > * {
  background: var(--color-card-bg);
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px var(--color-shadow);
  border: 1px solid var(--color-border);
}

/* 订单区域 */
.orders-section {
  margin-bottom: 60px;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.orders-header h2 {
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--color-primary);
}

.export-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}
.export-btn:hover,
.export-btn:focus-visible {
  background: var(--color-primary-hover);
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.4);
}

.export-btn .icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* 订单表格 */
.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  color: var(--color-text);
}

.orders-table th,
.orders-table td {
  border: 1px solid var(--color-border);
  padding: 14px 16px;
  text-align: left;
}

.orders-table th {
  background-color: var(--color-bg);
  font-weight: 600;
}

.orders-table tbody tr:hover,
.orders-table tbody tr:focus-within {
  background-color: rgba(37, 99, 235, 0.1);
  outline: none;
}

.orders-table tbody tr:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  user-select: none;
  display: inline-block;
  min-width: 80px;
  text-align: center;
}

.status-badge.completed {
  background-color: var(--color-success);
}

.status-badge.pending {
  background-color: var(--color-warning);
  color: #333;
}

.status-badge.cancelled {
  background-color: var(--color-error);
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 44px;
  height: 44px;
  font-size: 24px;
  border: none;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  transition: background-color 0.3s ease, transform 0.3s ease;
  z-index: 1000;
}
.back-to-top:hover,
.back-to-top:focus-visible {
  background-color: var(--color-primary-hover);
  outline: none;
  transform: scale(1.1);
}

/* 屏幕阅读器专用隐藏元素 */
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
</style>
