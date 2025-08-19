<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="dashboard-main">
      <Topbar />

      <div class="dashboard-content">
        <h1 class="dashboard-title">{{ t("customers.title") }}</h1>

        <!-- 搜索/筛选/操作 -->
        <div class="customers-header">
          <div class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('customers.searchPlaceholder')"
              @input="debouncedSearch"
              class="search-input"
            />
            <SearchIcon class="search-icon" />
          </div>

          <div class="status-filter">
            <select v-model="statusFilter" @change="doSearch">
              <option value="all">{{ t("customers.allStatus") }}</option>
              <option :value="true">{{ t("customers.active") }}</option>
              <option :value="false">{{ t("customers.inactive") }}</option>
            </select>
          </div>

          <div class="action-buttons">
            <button class="add-btn" @click="openModal()">
              <PlusIcon size="16" /> {{ t("customers.addCustomer") }}
            </button>
            <button class="export-btn" @click="exportCSV">
              <DownloadIcon size="16" /> {{ t("dashboard.exportCSV") }}
            </button>
          </div>
        </div>

        <!-- 客户卡片 -->
        <div class="customer-cards">
          <div v-for="c in customers" :key="c.id" class="customer-card">
            <div class="card-header">
              <div class="avatar">{{ c.name.charAt(0) }}</div>
              <h3>{{ c.name }}</h3>
            </div>
            <div class="card-info">
              <p>
                <strong>{{ t("customers.table.email") }}:</strong> {{ c.email }}
              </p>
              <p>
                <strong>{{ t("customers.table.phone") }}:</strong> {{ c.phone }}
              </p>
              <p>
                <strong>{{ t("customers.registered") }}:</strong>
                {{ c.registeredDate }}
              </p>
              <p>
                <strong>{{ t("customers.lastActivity") }}:</strong>
                {{ c.lastActivity }}
              </p>
            </div>
            <div class="card-status">
              <span
                :class="[
                  'status-badge',
                  c.active ? 'available' : 'discontinued',
                ]"
              >
                {{ c.active ? t("customers.active") : t("customers.inactive") }}
              </span>
            </div>
            <div class="card-actions">
              <button @click="openModal(c)" class="action-btn" title="Edit">
                <EditIcon size="16" />
              </button>
              <button
                @click="deleteCustomer(c)"
                class="action-btn danger"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <p v-if="customers.length === 0" class="no-results">
          {{ t("customers.noData") }}
        </p>

        <!-- 分页 -->
        <div class="pagination">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1"
          >
            {{ t("pagination.previous") }}
          </button>
          <span>{{
            t("pagination.pageInfo", { currentPage, totalPages })
          }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
          >
            {{ t("pagination.next") }}
          </button>
        </div>

        <!-- 弹窗 -->
        <CustomerModal
          v-if="showModal"
          :customer="editingCustomer"
          @close="closeModal"
          @save="saveCustomer"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import Sidebar from "@/components/layout/Sidebar.vue";
import Topbar from "@/components/layout/Topbar.vue";
import CustomerModal from "@/components/modals/CustomerModal.vue";
import { Edit, Plus, Download, Search } from "lucide-vue-next";
import { debounce } from "lodash-es";

const { t } = useI18n();
const EditIcon = Edit;
const PlusIcon = Plus;
const DownloadIcon = Download;
const SearchIcon = Search;

const allCustomers = ref([]);
const filteredCustomers = ref([]);
const customers = ref([]);
const searchQuery = ref("");
const statusFilter = ref("all");
const currentPage = ref(1);
const pageSize = ref(9);
const totalPages = ref(1);
const showModal = ref(false);
const editingCustomer = ref(null);

// mock 数据
function generateCustomers(total = 50) {
  return Array.from({ length: total }, (_, i) => {
    const registered = new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    const lastActive = new Date(
      2025,
      Math.floor(Math.random() * 8),
      Math.floor(Math.random() * 28) + 1
    );
    return {
      id: i + 1,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `123-456-${String(i + 1).padStart(3, "0")}`,
      active: Math.random() > 0.3,
      registeredDate: registered.toLocaleDateString(),
      lastActivity: lastActive.toLocaleDateString(),
    };
  });
}

function applyPagination() {
  totalPages.value = Math.ceil(filteredCustomers.value.length / pageSize.value);
  const start = (currentPage.value - 1) * pageSize.value;
  customers.value = filteredCustomers.value.slice(
    start,
    start + pageSize.value
  );
}

function doSearch() {
  const query = searchQuery.value.trim().toLowerCase();
  filteredCustomers.value = allCustomers.value.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query);
    const matchesStatus =
      statusFilter.value === "all" ||
      (statusFilter.value === true && c.active) ||
      (statusFilter.value === false && !c.active);
    return matchesSearch && matchesStatus;
  });
  currentPage.value = 1;
  applyPagination();
}
const debouncedSearch = debounce(doSearch, 300);

function openModal(customer = null) {
  editingCustomer.value = customer ? { ...customer } : null;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}
function saveCustomer(customer) {
  if (customer.id) {
    const index = allCustomers.value.findIndex((c) => c.id === customer.id);
    if (index !== -1) allCustomers.value[index] = customer;
  } else {
    customer.id = Date.now();
    allCustomers.value.push(customer);
  }
  doSearch();
  closeModal();
}
function deleteCustomer(customer) {
  if (!confirm(t("common.confirmDelete") || "Delete this customer?")) return;
  allCustomers.value = allCustomers.value.filter((c) => c.id !== customer.id);
  doSearch();
}
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    applyPagination();
  }
}
function exportCSV() {
  const rows = [
    [
      t("customers.table.name"),
      t("customers.table.email"),
      t("customers.table.phone"),
      t("customers.registered"),
      t("customers.lastActivity"),
    ],
    ...filteredCustomers.value.map((c) => [
      c.name,
      c.email,
      c.phone,
      c.registeredDate,
      c.lastActivity,
    ]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "customers.csv";
  a.click();
  URL.revokeObjectURL(url);
}

onMounted(() => {
  allCustomers.value = generateCustomers(50);
  filteredCustomers.value = allCustomers.value;
  applyPagination();
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text);
}
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}
.dashboard-content {
  padding: 24px;
  flex: 1;
  background-color: transparent;
}
.dashboard-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--color-text);
}

/* 顶部工具条 */
.customers-header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}
.search-container {
  position: relative;
  flex: 1;
  max-width: 300px;
}
.search-input {
  width: 100%;
  height: 40px;
  padding: 0 40px 0 12px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text);
}
.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary, #888);
}
.status-filter select {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text);
}
.action-buttons {
  display: flex;
  gap: 8px;
}
.action-buttons button {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.add-btn {
  background-color: var(--color-primary);
  color: #fff;
}
.add-btn:hover {
  background-color: var(--color-primary-hover);
}
.export-btn {
  background-color: var(--color-border);
  color: var(--color-text);
}
.export-btn:hover {
  background-color: var(--color-shadow);
}

/* 卡片网格 */
.customer-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
.customer-card {
  background-color: var(--color-card-bg);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px var(--color-shadow);
  border: 1px solid var(--color-border);
  transition: transform 0.2s;
  color: var(--color-text);
}
.customer-card:hover {
  transform: translateY(-2px);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.avatar {
  width: 36px;
  height: 36px;
  background-color: var(--color-primary);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.card-info p {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #666);
  margin: 2px 0;
}
.card-status {
  margin: 8px 0;
}
.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}
.action-btn {
  border: none;
  background-color: var(--color-border);
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--color-text);
}
.action-btn:hover {
  background-color: var(--color-shadow);
}
.action-btn.danger {
  background-color: var(--color-error);
  color: #fff;
}

/* 状态标签 */
.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.78rem;
}
.status-badge.available {
  background-color: rgba(16, 185, 129, 0.12);
  color: var(--color-success);
}
.status-badge.discontinued {
  background-color: rgba(239, 68, 68, 0.12);
  color: var(--color-error);
}

.no-results {
  text-align: center;
  padding: 16px;
  font-style: italic;
  color: var(--color-text-secondary, #888);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}
.pagination button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg);
  font-size: 0.88rem;
  cursor: pointer;
  color: var(--color-text);
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pagination span {
  min-width: 140px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #888);
}

@media (max-width: 640px) {
  .customer-cards {
    grid-template-columns: 1fr;
  }
}
</style>
