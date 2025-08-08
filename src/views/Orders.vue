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
        <h1 class="dashboard-title">{{ t("dashboard.orderManagement") }}</h1>

        <section aria-label="Order management" class="orders-section">
          <!-- 搜索框 -->
          <div class="orders-header">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by ID/Customer..."
              @input="handleSearch"
              class="search-input"
              aria-label="Search orders"
            />
            <button
              class="export-btn"
              @click="exportCSV"
              aria-label="Export orders as CSV"
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

          <!-- 订单表格 -->
          <table
            class="orders-table"
            role="table"
            aria-describedby="orders-desc"
          >
            <thead>
              <tr>
                <th scope="col">{{ t("dashboard.table.id") }}</th>
                <th scope="col">{{ t("dashboard.table.date") }}</th>

                <th scope="col">{{ t("dashboard.table.customer") }}</th>
                <th scope="col">{{ t("dashboard.table.items") }}</th>

                <th scope="col">{{ t("dashboard.table.total") }}</th>
                <th scope="col">{{ t("dashboard.table.status") }}</th>
                <th scope="col">{{ t("common.notes") }}</th>

                <th scope="col">{{ t("common.action") }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="o in filteredOrders" :key="o.id" tabindex="0">
                <td>{{ o.id }}</td>
                <td>{{ o.date }}</td>
                <td>{{ o.customer }}</td>
                <td>{{ o.items }}</td>
                <td class="total-cell">{{ o.total }}</td>
                <td>
                  <span :class="['status-badge', o.status.toLowerCase()]">
                    {{ o.status }}
                  </span>
                </td>
                <td class="notes-cell">
                  <span>{{ o.notes || "-" }}</span>
                </td>
                <td class="actions-cell">
                  <button
                    @click="viewDetails(o)"
                    class="action-btn"
                    :title="t('common.view')"
                  >
                    <EyeIcon size="16" />
                    <span class="action-label">{{ t("common.view") }}</span>
                  </button>
                  <button
                    @click="editOrder(o)"
                    class="action-btn"
                    :title="t('common.update')"
                  >
                    <EditIcon size="16" />
                    <span class="action-label">{{ t("common.update") }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 分页控件 -->
          <div class="pagination">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="pagination-btn"
            >
              {{ t("pagination.previous") }}
            </button>
            <span class="page-info">{{
              t("pagination.pageInfo", {
                currentPage: currentPage,
                totalPages: totalPages,
              })
            }}</span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="pagination-btn"
            >
              {{ t("pagination.next") }}
            </button>
          </div>
        </section>

        <!-- 返回顶部按钮 -->
        <button
          v-show="showBackTop"
          class="back-to-top"
          @click="scrollTop"
          aria-label="Back to top"
          title="Back to top"
        >
          ⬆
        </button>

        <OrderDetailModal
          v-if="selectedOrder"
          :order="selectedOrder"
          @close="selectedOrder = null"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import Topbar from "@/components/layout/Topbar.vue";

const { t } = useI18n();

const orders = ref([]);
const filteredOrders = ref([]);
const searchQuery = ref("");
const showBackTop = ref(false);
const currentPage = ref(1);
const selectedOrder = ref(null);
const pageSize = 10;
const totalPages = ref(1);

const viewDetails = (order) => {
  selectedOrder.value = order;
};

// 模拟生成订单数据
const generateOrders = (pageNum, pageSize) => {
  const statuses = ["Completed", "Processing", "Cancelled"];
  const customers = [
    "James Wilson",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Miller",
    "Sophia Wilson",
  ];
  const notes = [
    "Urgent delivery",
    "Gift wrapping",
    "Contact customer",
    null,
    null,
  ];

  return Array.from({ length: pageSize }, (_, i) => ({
    id: `ORD-${(pageNum - 1) * pageSize + 1000 + i}`,
    date: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    customer: customers[Math.floor(Math.random() * customers.length)],
    items: Math.floor(Math.random() * 5) + 1,
    total: (Math.random() * 500 + 10).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    notes: notes[Math.floor(Math.random() * notes.length)],
  }));
};

// 获取订单数据
const fetchOrders = () => {
  const ordersList = generateOrders(currentPage.value, pageSize);
  orders.value = ordersList;
  filteredOrders.value = orders.value;
  totalPages.value = Math.ceil(50 / pageSize); // 假设总共50条订单
};

// 搜索订单
const handleSearch = () => {
  const query = searchQuery.value.toLowerCase();
  filteredOrders.value = orders.value.filter(
    (order) =>
      order.customer.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      (order.notes && order.notes.toLowerCase().includes(query))
  );
};

// 导出CSV
const exportCSV = () => {
  const headers = [
    t("dashboard.table.id"),
    t("dashboard.table.date"),
    t("dashboard.table.customer"),
    t("dashboard.table.total"),
    t("dashboard.table.status"),
    t("common.notes"),
  ];

  const rows = allOrders.map((order) => [
    order.id,
    order.date,
    order.customer,
    order.total,
    order.status,
    order.notes || "N/A",
  ]);
  const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "orders.csv");
  link.click();
  URL.revokeObjectURL(url);
};

// 分页控制
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    fetchOrders();
  }
};

// 滚动监听，显示返回顶部按钮

const checkScroll = () => {
  const el = document.querySelector(".dashboard-main");
  showBackTop.value = el.scrollHeight > el.clientHeight && el.scrollTop > 300;
};

onMounted(() => {
  fetchOrders();
  const mainEl = document.querySelector(".dashboard-main");
  mainEl.addEventListener("scroll", checkScroll, { passive: true });
  checkScroll();
});

// 返回顶部
const scrollTop = () => {
  document
    .querySelector(".dashboard-main")
    .scrollTo({ top: 0, behavior: "smooth" });
};
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
  width: 100%;
}

.orders-section {
  margin-top: 40px;
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

.search-input {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  width: 250px;
  font-size: 1rem;
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
}

.export-btn .icon {
  width: 18px;
  height: 18px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  color: var(--color-text);
}

.orders-table th,
.orders-table td {
  border: none;
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
}

.status-badge {
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
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
  transition: background-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
  opacity: 0; /* 初始为透明 */
  pointer-events: none; /* 避免点击时按钮存在 */
}

.back-to-top[v-show="true"] {
  opacity: 1;
  pointer-events: auto; /* 使按钮可点击 */
}

.back-to-top:hover,
.back-to-top:focus-visible {
  background-color: var(--color-primary-hover);
  transform: scale(1.1);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-btn:hover,
.pagination-btn:focus-visible {
  background-color: var(--color-primary-hover);
}

.page-info {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: var(--color-text);
}

/* 新增这些样式，不影响原有样式 */
.total-cell {
  font-weight: 600;
  color: var(--color-text-dark);
}

.notes-cell {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: var(--color-primary);
  background: rgba(37, 99, 235, 0.1);
}

/* 状态标签优化 */
.status-badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.completed {
  background-color: #e6f7ee;
  color: #00a76f;
}

.status-badge.processing {
  background-color: #fff7e6;
  color: #ff9500;
}

.status-badge.cancelled {
  background-color: #ffebee;
  color: #f44336;
}
.action-label {
  margin-left: 6px;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .action-label {
    display: none;
  }
}
</style>
