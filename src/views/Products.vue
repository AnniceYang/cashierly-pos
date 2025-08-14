<template>
  <div class="dashboard-layout">
    <Sidebar />

    <div class="dashboard-main">
      <Topbar />

      <div class="dashboard-content">
        <h1 class="dashboard-title">{{ t("dashboard.productManagement") }}</h1>

        <!-- 搜索+操作按钮 -->
        <div class="products-header">
          <div class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('dashboard.searchProductPlaceholder')"
              @input="debouncedSearch"
              class="search-input"
            />
          </div>

          <div class="action-buttons">
            <button class="add-btn" @click="openAddProduct">
              <PlusIcon size="16" />{{ t("products.add") }}
            </button>
            <button class="export-btn" @click="exportCSV">
              <DownloadIcon size="16" />{{ t("dashboard.exportCSV") }}
            </button>
          </div>
        </div>

        <!-- 产品列表 -->
        <table class="products-table">
          <thead>
            <tr>
              <th>{{ t("products.id") }}</th>
              <th>{{ t("products.image") }}</th>
              <th>{{ t("products.name") }}</th>
              <th>{{ t("products.category") }}</th>
              <th>{{ t("products.price") }}</th>
              <th>{{ t("products.stock") }}</th>
              <th>{{ t("products.status.name") }}</th>
              <th>{{ t("common.action") }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td>{{ p.id }}</td>
              <td>
                <img :src="getProductImage(p.image)" alt="" class="thumb" />
              </td>
              <td>{{ p.name }}</td>
              <td>{{ p.category }}</td>
              <td>{{ currencyFormat(p.price) }}</td>
              <td>{{ p.stock }}</td>
              <td>
                <span :class="['status-badge', p.status.toLowerCase()]">
                  {{ t(`products.status.${p.status.toLowerCase()}`) }}
                </span>
              </td>

              <td class="actions-cell">
                <button @click="viewDetails(p)" class="action-btn">
                  <EyeIcon size="16" />{{ t("common.view") }}
                </button>
                <button @click="editProduct(p)" class="action-btn">
                  <EditIcon size="16" />{{ t("common.update") }}
                </button>
                <button @click="deleteProduct(p)" class="action-btn danger">
                  {{ t("common.delete") }}
                </button>
              </td>
            </tr>

            <tr v-if="products.length === 0">
              <td colspan="8" class="no-results">
                {{ t("dashboard.noProductsFound") }}
              </td>
            </tr>
          </tbody>
        </table>

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
        <ProductDetailModal
          v-if="selectedProduct"
          :product="selectedProduct"
          @close="selectedProduct = null"
        />

        <EditProductModal
          v-if="editingProduct"
          :product="editingProduct"
          @close="editingProduct = null"
          @save="saveProduct"
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
import { Eye, Edit, Plus, Download } from "lucide-vue-next";
import ProductDetailModal from "@/components/modals/ProductDetailModal.vue";
import EditProductModal from "@/components/modals/EditProductModal.vue";
import { debounce } from "lodash-es";

const { t } = useI18n();

const EyeIcon = Eye;
const EditIcon = Edit;
const PlusIcon = Plus;
const DownloadIcon = Download;

const allProducts = ref([]);
const filteredProducts = ref([]);
const products = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = 10;
const totalPages = ref(1);

const selectedProduct = ref(null);
const editingProduct = ref(null);

const productImages = import.meta.glob("@/assets/img/*.jpg", {
  eager: true,
  import: "default",
});

function getProductImage(filename) {
  return (
    productImages[`/src/assets/img/${filename}`] ||
    productImages["/src/assets/img/Product1.jpg"] ||
    ""
  );
}

function currencyFormat(value) {
  return `$${parseFloat(value).toFixed(2)}`;
}

const generateProducts = (total = 50) => {
  const categories = ["Electronics", "Clothing", "Books", "Accessories"];
  const statuses = ["Available", "OutOfStock", "Discontinued"];

  return Array.from({ length: total }, (_, i) => ({
    id: `PRD-${1000 + i}`,
    name: `Product ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: (Math.random() * 200 + 10).toFixed(2),
    stock: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    image: `Product${(i % 5) + 1}.jpg`,
    description: "This is a sample product description for display purposes.",
  }));
};

function applyPagination() {
  totalPages.value = Math.ceil(filteredProducts.value.length / pageSize);
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  products.value = filteredProducts.value.slice(start, end);
}

function doSearch() {
  const query = searchQuery.value.trim().toLowerCase();
  filteredProducts.value = allProducts.value.filter(
    (p) =>
      p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query)
  );
  currentPage.value = 1;
  applyPagination();
}

const debouncedSearch = debounce(doSearch, 300);

function fetchProducts() {
  allProducts.value = generateProducts(50);
  filteredProducts.value = allProducts.value;
  applyPagination();
}

function viewDetails(product) {
  selectedProduct.value = product;
}

function editProduct(product) {
  editingProduct.value = { ...product };
}

function openAddProduct() {
  editingProduct.value = {
    id: `PRD-${1000 + allProducts.value.length}`,
    name: "",
    category: "",
    price: "0.00",
    stock: 0,
    status: "Available",
    image: "",
    description: "",
  };
}

function saveProduct(updatedProduct) {
  const index = allProducts.value.findIndex((p) => p.id === updatedProduct.id);
  if (index === -1) {
    allProducts.value.push(updatedProduct);
  } else {
    allProducts.value[index] = updatedProduct;
  }
  doSearch();
  editingProduct.value = null;
}

function deleteProduct(product) {
  if (!confirm(t("common.confirmDelete") || "Delete this product?")) return;
  const idx = allProducts.value.findIndex((p) => p.id === product.id);
  if (idx !== -1) {
    allProducts.value.splice(idx, 1);
    doSearch();
  }
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    applyPagination();
  }
}

function exportCSV() {
  const rows = [
    ["ID", "Name", "Category", "Price", "Stock", "Status"],
    ...filteredProducts.value.map((p) => [
      p.id,
      p.name,
      p.category,
      String(p.price),
      String(p.stock),
      p.status,
    ]),
  ];
  const csv = rows
    .map((r) =>
      r
        .map((field) => {
          const s = String(field ?? "");
          // 简单转义：含逗号或引号时包裹并转义引号
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products.csv";
  a.click();
  URL.revokeObjectURL(url);
}

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* ===== 布局基础（修复滚动） ===== */
.dashboard-layout {
  display: flex;
  height: 100vh; /* 让主容器铺满视口 */
  background-color: var(--color-bg);
  color: var(--color-text);
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 关键 */
  overflow-y: auto; /* 关键 */
}

.dashboard-content {
  padding: 24px;
  flex: 1;
  min-height: 0; /* 关键：在 flex 布局中避免高度被撑爆 */
}

/* ===== 标题 ===== */
.dashboard-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
}

/* ===== 顶部工具栏（搜索 + 按钮） ===== */
.products-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.search-container {
  flex: 1;
  max-width: 360px;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
  background-color: var(--color-input-bg, #fff);
  color: var(--color-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* ===== 按钮样式 ===== */
.action-buttons {
  display: flex;
  gap: 10px;
}

.add-btn,
.export-btn,
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.2s ease,
    box-shadow 0.2s ease;
  white-space: nowrap;
}

.add-btn {
  background-color: var(--color-primary);
  color: #fff;
}
.add-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}
.add-btn:active {
  transform: translateY(0);
}

.export-btn {
  background-color: var(--color-secondary, #475569);
  color: #fff;
}
.export-btn:hover {
  background-color: var(--color-secondary-hover, #334155);
  transform: translateY(-1px);
}
.export-btn:active {
  transform: translateY(0);
}

.action-btn {
  background-color: var(--color-light, #f3f4f6);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.action-btn:hover {
  background-color: var(--color-primary-light, rgba(37, 99, 235, 0.08));
  color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.action-btn.danger {
  background-color: rgba(239, 68, 68, 0.12);
  color: rgb(220, 38, 38);
  border-color: rgba(239, 68, 68, 0.35);
}
.action-btn.danger:hover {
  background-color: rgba(239, 68, 68, 0.18);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* ===== 表格样式 ===== */
.products-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-card, #fff);
  border-radius: 12px;
  overflow: hidden; /* 让圆角生效 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.products-table thead {
  background-color: var(--color-table-header, #f8f9fb);
}
.products-table th {
  text-align: left;
  padding: 12px 14px;
  font-weight: 700;
  color: var(--color-text-dark, #222);
  font-size: 0.9rem;
  letter-spacing: 0.2px;
}

.products-table td {
  padding: 12px 14px;
  border-top: 1px solid var(--color-border);
  font-size: 0.92rem;
  vertical-align: middle;
}

.products-table tbody tr:hover {
  background-color: rgba(37, 99, 235, 0.05);
}

.thumb {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--color-border);
}

/* 状态标签 */
.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.2px;
  display: inline-block;
}
.status-badge.available {
  background-color: rgba(16, 185, 129, 0.12);
  color: rgb(5, 150, 105);
}
.status-badge.outofstock {
  background-color: rgba(239, 68, 68, 0.12);
  color: rgb(185, 28, 28);
}
.status-badge.discontinued {
  background-color: rgba(107, 114, 128, 0.12);
  color: rgb(75, 85, 99);
}

.actions-cell {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 没有数据提示 */
.no-results {
  text-align: center;
  padding: 16px;
  color: var(--color-text-secondary, #6b7280);
  font-style: italic;
}

/* ===== 分页 ===== */
.pagination {
  display: flex;
  justify-content: center; /* 居中 */
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.pagination button {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-light, #f3f4f6);
  color: var(--color-text);
  font-size: 0.88rem;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.pagination button:hover {
  background-color: rgba(37, 99, 235, 0.08);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.pagination button:disabled {
  background-color: var(--color-disabled, #e5e7eb);
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}
.pagination span {
  min-width: 140px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #6b7280);
}

/* ===== 响应式 ===== */
@media (max-width: 960px) {
  .search-container {
    max-width: 100%;
  }
  .products-table th,
  .products-table td {
    padding: 10px;
  }
}

@media (max-width: 640px) {
  .products-header {
    flex-direction: column;
    align-items: stretch;
  }
  .action-buttons {
    justify-content: flex-start;
  }
}

/* ===== 暗黑模式 ===== */ /* ===== 完整暗黑模式适配 ===== */
[data-theme="dark"] {
  --color-bg: #121212; /* 页面背景 */
  --color-card: #1f1f1f; /* 卡片 / 表格背景 */
  --color-table-header: #2a2a2a; /* 表头 */
  --color-text: #e5e7eb; /* 主文字 */
  --color-text-dark: #ffffff; /* 强调文字 */
  --color-text-secondary: #a1a1aa; /* 次要文字 */
  --color-border: #333; /* 边框线 */
  --color-light: #2a2a2a; /* 按钮背景 */
  --color-primary: #3b82f6; /* 蓝色主色 */
  --color-primary-hover: #2563eb;
  --color-primary-light: rgba(59, 130, 246, 0.15); /* hover 背景 */
  --color-secondary: #475569; /* 导出按钮色 */
  --color-secondary-hover: #334155;
  --color-disabled: #4b5563;
}

/* 页面容器背景 */
[data-theme="dark"] .dashboard-layout,
[data-theme="dark"] .dashboard-main,
[data-theme="dark"] .dashboard-content {
  background-color: var(--color-bg);
  color: var(--color-text);
}

/* 表格 */
[data-theme="dark"] .products-table {
  background-color: var(--color-card);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .products-table thead {
  background-color: var(--color-table-header);
}

[data-theme="dark"] .products-table th,
[data-theme="dark"] .products-table td {
  color: var(--color-text);
  border-top: 1px solid var(--color-border);
}

[data-theme="dark"] .products-table tbody tr:hover {
  background-color: rgba(59, 130, 246, 0.15);
}

/* 状态标签 */
[data-theme="dark"] .status-badge.available {
  background-color: rgba(16, 185, 129, 0.25);
  color: rgb(5, 150, 105);
}
[data-theme="dark"] .status-badge.outofstock {
  background-color: rgba(239, 68, 68, 0.25);
  color: rgb(220, 38, 38);
}
[data-theme="dark"] .status-badge.discontinued {
  background-color: rgba(107, 114, 128, 0.25);
  color: rgb(200, 200, 200);
}

/* 搜索框 */
[data-theme="dark"] .search-input {
  background-color: #2a2a2a;
  border-color: #444;
  color: #e5e7eb;
}
[data-theme="dark"] .search-input::placeholder {
  color: #a1a1aa;
}

/* 顶部操作按钮 */
[data-theme="dark"] .add-btn,
[data-theme="dark"] .export-btn,
[data-theme="dark"] .action-btn {
  color: #fff;
}

[data-theme="dark"] .add-btn {
  background-color: var(--color-primary);
}
[data-theme="dark"] .add-btn:hover {
  background-color: var(--color-primary-hover);
}

[data-theme="dark"] .export-btn {
  background-color: var(--color-secondary);
}
[data-theme="dark"] .export-btn:hover {
  background-color: var(--color-secondary-hover);
}

[data-theme="dark"] .action-btn {
  background-color: var(--color-light);
  border-color: #444;
  color: #e5e7eb;
}
[data-theme="dark"] .action-btn:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
[data-theme="dark"] .action-btn.danger {
  background-color: rgba(239, 68, 68, 0.25);
  color: rgb(220, 38, 38);
  border-color: rgba(239, 68, 68, 0.4);
}

/* 分页 */
[data-theme="dark"] .pagination button {
  background-color: #2a2a2a;
  border-color: #444;
  color: #e5e7eb;
}
[data-theme="dark"] .pagination button:hover:not(:disabled) {
  background-color: rgba(59, 130, 246, 0.15);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
[data-theme="dark"] .pagination button:disabled {
  background-color: #4b5563;
  color: #9ca3af;
}

/* 没有数据提示 */
[data-theme="dark"] .no-results {
  color: #a1a1aa;
}

/* 图片边框 */
[data-theme="dark"] .thumb {
  border: 1px solid #444;
}
</style>
