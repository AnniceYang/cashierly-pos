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
            <button
              class="add-btn"
              @click="openAddProduct"
              :title="t('products.add')"
            >
              <PlusIcon size="16" />{{ t("products.add") }}
            </button>
            <button
              class="export-btn"
              @click="exportCSV"
              :title="t('dashboard.exportCSV')"
            >
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
                <img
                  :src="getProductImage(p.image)"
                  alt=""
                  class="thumb"
                  @click="previewImage(p.image)"
                  :title="t('products.previewImage')"
                />
              </td>
              <td :title="p.name">{{ p.name }}</td>
              <td>{{ p.category }}</td>
              <td>{{ currencyFormat(p.price) }}</td>
              <td>{{ p.stock }}</td>
              <td>
                <span :class="['status-badge', p.status.toLowerCase()]">
                  {{ t(`products.status.${p.status.toLowerCase()}`) }}
                </span>
              </td>

              <td class="actions-cell">
                <button
                  @click="viewDetails(p)"
                  class="action-btn"
                  :title="t('common.view')"
                >
                  <EyeIcon size="16" />{{ t("common.view") }}
                </button>
                <button
                  @click="editProduct(p)"
                  class="action-btn"
                  :title="t('common.update')"
                >
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
          :isEdit="isEditing"
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

const isEditing = ref(false);

function editProduct(product) {
  isEditing.value = true;
  editingProduct.value = { ...product };
}

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

function openAddProduct() {
  isEditing.value = false;
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
  min-height: 100vh; /* 改为 min-height 更健壮 */
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
  background-color: transparent;
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
  background-color: transparent;
  color: rgb(239, 68, 68);
  border: 1px solid rgba(239, 68, 68, 0.4);
}
.action-btn.danger:hover {
  background-color: rgba(239, 68, 68, 0.15);
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

/* ===========================
   暗黑模式（使用你 Topbar 的全局变量）
   - 关键点：Topbar 用的是 --color-bg / --color-text / --color-shadow
   - 这里完全沿用这些变量，保证颜色一致
   =========================== */

/* 最重要：让根级的 .dark 或 [data-theme="dark"] 生效到这些组件 */
[data-theme="dark"] .dashboard-layout,
[data-theme="dark"] .dashboard-main,
[data-theme="dark"] .dashboard-content,
.dark .dashboard-layout,
.dark .dashboard-main,
.dark .dashboard-content {
  background-color: var(--color-bg) !important; /* 与 Topbar 一致 */
  color: var(--color-text) !important;
  box-shadow: 0 2px 8px var(--color-shadow, rgba(0, 0, 0, 0.4)) !important;
}

/* 让表格也使用同一背景（和 Topbar 一致）——如果你想表格比外层深一点，可换成 var(--color-card-bg) */
[data-theme="dark"] .products-table,
.dark .products-table {
  background-color: var(--color-bg) !important; /* 与 Topbar 一致 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
  border-radius: 12px;
  overflow: hidden;
}

/* 表头使用专用变量（如果全局定义了 --color-table-header-bg，会使用它） */
[data-theme="dark"] .products-table thead,
.dark .products-table thead {
  background-color: var(
    --color-table-header-bg,
    rgba(255, 255, 255, 0.03)
  ) !important;
}
[data-theme="dark"] .products-table th,
.dark .products-table th {
  color: var(--color-table-header-text, var(--color-text)) !important;
  border-color: var(
    --color-table-header-border,
    rgba(255, 255, 255, 0.04)
  ) !important;
}

/* 单元格文字、边框 */
[data-theme="dark"] .products-table td,
.dark .products-table td {
  color: var(--color-text) !important;
  border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.04)) !important;
  background-color: transparent !important; /* 继承外层背景 */
}

/* hover 行使用稍亮的卡片色（如果你定义了 --color-card-bg 会更好看） */
[data-theme="dark"] .products-table tbody tr:hover td,
.dark .products-table tbody tr:hover td {
  background-color: var(--color-card-bg, rgba(255, 255, 255, 0.02)) !important;
}

/* 搜索框（靠近 topbar 风格） */
[data-theme="dark"] .search-input,
.dark .search-input {
  background-color: var(--color-card-bg, rgba(255, 255, 255, 0.02)) !important;
  border-color: var(--color-border, rgba(255, 255, 255, 0.04)) !important;
  color: var(--color-text) !important;
}
[data-theme="dark"] .search-input::placeholder,
.dark .search-input::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* 按钮（主色、次色继承全局变量） */
[data-theme="dark"] .add-btn,
.dark .add-btn {
  background-color: var(--color-primary) !important;
  color: #fff !important;
}
[data-theme="dark"] .add-btn:hover,
.dark .add-btn:hover {
  background-color: var(--color-primary-hover) !important;
}

[data-theme="dark"] .export-btn,
.dark .export-btn {
  background-color: var(--color-secondary, #475569) !important;
  color: #fff !important;
}
[data-theme="dark"] .export-btn:hover,
.dark .export-btn:hover {
  background-color: var(--color-secondary-hover, #334155) !important;
}

[data-theme="dark"] .action-btn,
.dark .action-btn {
  background-color: var(--color-card-bg, rgba(255, 255, 255, 0.02)) !important;
  border-color: var(--color-border, rgba(255, 255, 255, 0.04)) !important;
  color: var(--color-text) !important;
}
[data-theme="dark"] .action-btn:hover,
.dark .action-btn:hover {
  background-color: rgba(59, 130, 246, 0.08) !important;
  color: var(--color-primary) !important;
}

/* danger 按钮 */
[data-theme="dark"] .action-btn.danger,
.dark .action-btn.danger {
  background-color: rgba(239, 68, 68, 0.18) !important;
  color: var(--color-error, #f87171) !important;
  border-color: rgba(239, 68, 68, 0.3) !important;
}

/* 分页 */
[data-theme="dark"] .pagination button,
.dark .pagination button {
  background-color: var(--color-card-bg, rgba(255, 255, 255, 0.02)) !important;
  border-color: var(--color-border, rgba(255, 255, 255, 0.04)) !important;
  color: var(--color-text) !important;
}
[data-theme="dark"] .pagination button:disabled,
.dark .pagination button:disabled {
  background-color: var(--color-disabled, rgba(255, 255, 255, 0.03)) !important;
  color: rgba(255, 255, 255, 0.5) !important;
}

/* 无数据提示 */
[data-theme="dark"] .no-results,
.dark .no-results {
  color: rgba(255, 255, 255, 0.65) !important;
}

/* 图片边框 */
[data-theme="dark"] .thumb,
.dark .thumb {
  border: 1px solid var(--color-border, rgba(255, 255, 255, 0.06)) !important;
}

/* 小幅调整滚动条在暗色下更明显 */
[data-theme="dark"] .dashboard-main::-webkit-scrollbar,
.dark .dashboard-main::-webkit-scrollbar {
  width: 8px;
}
[data-theme="dark"] .dashboard-main::-webkit-scrollbar-thumb,
.dark .dashboard-main::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
}

[data-theme="dark"] .status-badge.discontinued,
.dark .status-badge.discontinued {
  background-color: rgba(156, 163, 175, 0.25); /* 更亮灰背景 */
  color: rgba(229, 231, 235, 0.85); /* 浅灰文字 */
}

[data-theme="dark"] .action-btn.danger,
.dark .action-btn.danger {
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.5);
}
</style>
