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
            <div class="search-container">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by ID/Customer..."
                @input="debouncedSearch"
                class="search-input"
                aria-label="Search orders"
              />
              <SearchIcon class="search-icon" aria-hidden="true" />
            </div>
            <button
              class="export-btn"
              @click="exportCSV"
              aria-label="Export orders as CSV"
              title="Export CSV"
            >
              <DownloadIcon size="16" aria-hidden="true" />
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
                  <span :class="['status-badge', o.status.toLowerCase()]">{{
                    o.status
                  }}</span>
                </td>
                <td class="notes-cell">
                  <span>{{ o.notes || "-" }}</span>
                </td>
                <td class="actions-cell">
                  <button
                    @click="viewDetails(o)"
                    class="action-btn"
                    :title="t('common.view')"
                    aria-label="View order details"
                  >
                    <EyeIcon size="16" aria-hidden="true" />
                    <span class="action-label">{{ t("common.view") }}</span>
                  </button>
                  <button
                    @click="editOrder(o)"
                    class="action-btn"
                    :title="t('common.update')"
                    aria-label="Edit order"
                  >
                    <EditIcon size="16" aria-hidden="true" />
                    <span class="action-label">{{ t("common.update") }}</span>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="8" class="no-results">
                  {{ t("dashboard.noOrdersFound") || "No orders found." }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 分页控件 -->
          <div
            class="pagination"
            role="navigation"
            aria-label="Pagination Navigation"
          >
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="pagination-btn"
              aria-label="Previous page"
            >
              {{ t("pagination.previous") }}
            </button>
            <span class="page-info" aria-live="polite" aria-atomic="true">
              {{
                t("pagination.pageInfo", {
                  currentPage: currentPage,
                  totalPages: totalPages,
                })
              }}
            </span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="pagination-btn"
              aria-label="Next page"
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

        <!-- 订单详情弹窗 -->
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
import { Eye, Edit, Search, ArrowUp, Download } from "lucide-vue-next";
import OrderDetailModal from "@/components/modals/OrderDetailModal.vue";
import { debounce } from "lodash-es"; // 如果没装lodash，可以用自己写防抖函数

const EyeIcon = Eye;
const EditIcon = Edit;
const SearchIcon = Search;
const ArrowUpIcon = ArrowUp;
const DownloadIcon = Download;

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

const fetchOrders = () => {
  const ordersList = generateOrders(currentPage.value, pageSize);
  orders.value = ordersList;
  filteredOrders.value = orders.value;
  totalPages.value = Math.ceil(50 / pageSize);
};

const doSearch = () => {
  const query = searchQuery.value.toLowerCase();
  filteredOrders.value = orders.value.filter(
    (order) =>
      order.customer.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      (order.notes && order.notes.toLowerCase().includes(query))
  );
};

const debouncedSearch = debounce(doSearch, 300);
const escapeCSVField = (field) => {
  if (typeof field === "string" && field.includes(",")) {
    // 如果字段中有逗号，包双引号，且双引号内的引号需要转义成两个双引号
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};

const exportCSV = () => {
  const headers = [
    t("dashboard.table.id"),
    t("dashboard.table.date"),
    t("dashboard.table.customer"),
    t("dashboard.table.total"),
    t("dashboard.table.status"),
    t("common.notes"),
  ];

  const rows = filteredOrders.value.map((order) => [
    order.id,
    order.date,
    order.customer,
    order.total,
    order.status,
    order.notes || "N/A",
  ]);

  // 对每个字段做转义
  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCSVField).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `orders_page_${currentPage.value}.csv`);
  link.click();
  URL.revokeObjectURL(url);
};

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    fetchOrders();
  }
};

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

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  width: 250px;
  font-size: 1rem;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.search-icon {
  position: absolute;
  right: 12px;
  color: var(--color-text-secondary);
  pointer-events: none;
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

/* Orders table */
.orders-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-bg);
  color: var(--color-text);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.orders-table th,
.orders-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.orders-table th {
  background: linear-gradient(to bottom, #f8f8f8, #e1e1e1);
  font-weight: 600;
  color: var(--color-text-dark);
  text-align: left;
  box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.05);
}

.orders-table tbody tr:hover {
  background-color: rgba(37, 99, 235, 0.1);
}

.orders-table tbody tr:focus-within {
  background-color: rgba(37, 99, 235, 0.15);
  outline: none;
}

/* Status badges */
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

.status-badge.processing {
  background-color: var(--color-warning);
}

.status-badge.cancelled {
  background-color: var(--color-error);
}

/* Pagination */
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

.pagination-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Back to top button */
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
  opacity: 0;
  pointer-events: none;
}

.back-to-top[v-show="true"] {
  opacity: 1;
  pointer-events: auto;
}

.back-to-top:hover {
  background-color: var(--color-primary-hover);
  transform: scale(1.1);
}

/* Actions */
.actions-cell {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  background-color: transparent;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  border: none; /* 去掉默认边框 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  min-width: 100px;
  box-sizing: border-box;
  outline: none;
}

.action-btn:hover,
.action-btn:focus-visible {
  color: var(--color-primary);
  background-color: rgba(37, 99, 235, 0.1);
  box-shadow: 0 0 0 2px var(--color-primary);
  outline: none;
}

.action-btn:disabled {
  color: var(--color-text-disabled);
  border-color: transparent;
  cursor: not-allowed;
  background-color: transparent;
}

/* No results */
.no-results {
  text-align: center;
  font-style: italic;
  color: var(--color-text-secondary);
  padding: 16px 0;
}

/* Responsive 手机端适配 */
@media (max-width: 768px) {
  .orders-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-input {
    width: 100%;
  }

  .export-btn {
    width: 100%;
    margin-top: 10px;
  }

  .orders-table th,
  .orders-table td {
    padding: 10px;
  }

  .pagination {
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
  }

  .pagination-btn {
    margin-bottom: 5px;
  }

  .back-to-top {
    width: 48px;
    height: 48px;
    font-size: 28px;
    right: 15px;
    bottom: 15px;
  }

  .actions-cell {
    justify-content: space-between;
    gap: 8px;
  }

  .action-btn {
    min-width: auto;
    flex-grow: 0;
  }
}

/* ========== 暗黑模式支持 ========== */
:root {
  --color-bg: #fff;
  --color-text: #222;
  --color-text-secondary: #666;
  --color-text-dark: #333;
  --color-border: #ddd;
  --color-primary: #2563eb;
  --color-primary-hover: #1e40af;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-text-disabled: #aaa;
}

[data-theme="dark"] {
  --color-bg: #121212;
  --color-text: #e0e0e0;
  --color-text-secondary: #aaa;
  --color-text-dark: #ddd;
  --color-border: #444;
  --color-primary: #3b82f6;
  --color-primary-hover: #60a5fa;
  --color-success: #22c55e;
  --color-warning: #facc15;
  --color-error: #ef4444;
  --color-text-disabled: #555;
}

/* 表头暗黑调整 */
/* 暗黑模式表头背景和表身一致，文字更亮，带分割线 */
[data-theme="dark"] .orders-table {
  background-color: #1a1a1a; /* 比纯黑稍亮的背景 */
  border-radius: 8px; /* 可选：添加圆角 */
  overflow: hidden; /* 确保圆角生效 */
}

[data-theme="dark"] .orders-table th {
  background: linear-gradient(
    to bottom,
    #2d2d2d,
    #1f1f1f
  ); /* 更细腻的深色渐变 */
  color: #ffffff;
  font-weight: 500; /* 暗黑模式下稍轻的字重 */
  border-bottom: 1px solid #3a3a3a;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3); /* 文字阴影增强可读性 */
  position: sticky;
  top: 0;
  z-index: 2;
}

/* 更精致的表头底部高光 */
[data-theme="dark"] .orders-table th::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
}

/* 单元格样式优化 */
[data-theme="dark"] .orders-table td {
  border-bottom: 1px solid #2d2d2d;
  background-color: #1a1a1a;
}

/* 悬停效果优化 */
[data-theme="dark"] .orders-table tbody tr:hover {
  background-color: rgba(59, 130, 246, 0.12);
  transition: background-color 0.2s ease;
}

[data-theme="dark"] .orders-table tbody tr:focus-within {
  background-color: rgba(59, 130, 246, 0.2);
  outline: 1px dashed var(--color-primary);
}

/* 按钮交互优化 */
[data-theme="dark"] .action-btn:hover,
[data-theme="dark"] .action-btn:focus-visible {
  background-color: rgba(59, 130, 246, 0.25);
  box-shadow: 0 0 0 2px var(--color-primary),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* 表格整体阴影效果 */
[data-theme="dark"] .orders-table {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
</style>
