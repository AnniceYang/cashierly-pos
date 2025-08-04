<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="dashboard-main">
      <Topbar />

      <div class="dashboard-content">
        <h1>{{ t("dashboard.title") }}</h1>
        <p>{{ t("dashboard.welcome") }}</p>

        <div class="stats-cards">
          <div v-for="item in stats" :key="item.titleKey" class="stat-card">
            <h3>{{ t(item.titleKey) }}</h3>
            <p class="value">{{ item.value }}</p>
          </div>
        </div>

        <SalesChart />

        <h2>{{ t("dashboard.recentOrders") }}</h2>
        <table class="orders-table">
          <thead>
            <tr>
              <th>{{ t("dashboard.table.id") }}</th>
              <th>{{ t("dashboard.table.customer") }}</th>
              <th>{{ t("dashboard.table.total") }}</th>
              <th>{{ t("dashboard.table.status") }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="o in recentOrders" :key="o.id">
              <td>{{ o.id }}</td>
              <td>{{ o.customer }}</td>
              <td>{{ o.total }}</td>
              <td>{{ o.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import Sidebar from "@/components/layout/Sidebar.vue";
import Topbar from "@/components/layout/Topbar.vue";
import SalesChart from "../components/Charts/SalesChart.vue";

const { t } = useI18n();

const stats = [
  { titleKey: "dashboard.sales", value: "$1,200" },
  { titleKey: "dashboard.orders", value: "32" },
  { titleKey: "dashboard.customers", value: "18" },
];

const recentOrders = [
  { id: "ORD-001", customer: "Alice", total: "$120", status: "Completed" },
  { id: "ORD-002", customer: "Tom", total: "$90", status: "Pending" },
  { id: "ORD-003", customer: "Charlie", total: "$210", status: "Completed" },
];
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  overflow: hidden;
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: var(--color-bg); /* 使用全局白背景 */
}

.dashboard-content {
  padding: 24px;
  margin: 0;
  box-sizing: border-box;
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 24px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-3px);
}
.stat-card .value {
  font-size: 1.6rem;
  font-weight: bold;
  color: #ec4899;
}

.section-title {
  font-size: 1.25rem;
  margin-bottom: 12px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}
.orders-table th,
.orders-table td {
  border: 1px solid #e5e7eb;
  padding: 12px;
}
.orders-table th {
  background-color: #f9fafb;
  text-align: left;
  font-weight: 500;
}
</style>
