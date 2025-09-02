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
              aria-label="Search products"
            />
            <SearchIcon class="search-icon" aria-hidden="true" />
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

              <td>
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
                <button
                  @click="deleteProduct(p)"
                  class="action-btn danger"
                  :title="t('common.delete')"
                >
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
import { Eye, Edit, Plus, Download, Search } from "lucide-vue-next";
import ProductDetailModal from "@/components/modals/ProductDetailModal.vue";
import EditProductModal from "@/components/modals/EditProductModal.vue";
import { debounce } from "lodash-es";

const { t } = useI18n();

const EyeIcon = Eye;
const EditIcon = Edit;
const PlusIcon = Plus;
const DownloadIcon = Download;
const SearchIcon = Search;

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
/* ===== 布局基础 ===== */
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
  overflow-y: auto;
}

.dashboard-content {
  padding: 24px;
  flex: 1;
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
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 360px;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 8px 40px 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
  background-color: var(--color-card-bg);
  color: var(--color-text);
}
.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3 rgba(37, 99, 235, 0.15);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-text-secondary, #6b7280);
}

/* ===== 顶部操作按钮（新增、导出） ===== */
.action-buttons {
  display: flex;
  gap: 10px;
}

.add-btn,
.export-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: transform 0.15s, background-color 0.2s, box-shadow 0.2s;
}

.add-btn {
  background-color: var(--color-primary);
  color: #fff;
}
.add-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.export-btn {
  background-color: var(--color-secondary, #475569);
  color: #fff;
}
.export-btn:hover {
  background-color: var(--color-secondary-hover, #334155);
  transform: translateY(-1px);
}

/* ===== 表格内操作按钮 ===== */
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  background-color: transparent; /* 透出行 hover 背景 */
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}
.action-btn:last-child {
  margin-right: 0;
}
.action-btn:hover {
  background-color: rgba(37, 99, 235, 0.08);
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.action-btn.danger {
  color: var(--color-error, #ef4444);
  border: 1px solid rgba(239, 68, 68, 0.4);
}
.action-btn.danger:hover {
  background-color: rgba(239, 68, 68, 0.15);
  color: var(--color-error, #ef4444);
  border-color: var(--color-error, #ef4444);
}

/* ===== 表格 ===== */
.products-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  background-color: var(--color-card-bg);
}

.products-table th,
.products-table td {
  padding: 12px 14px;
}

.products-table th {
  text-align: left;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-table-header-text, var(--color-text));
  background-color: var(--color-table-header-bg, var(--color-card-bg));
  border-bottom: 2px solid var(--color-table-header-border, var(--color-border));
}

.products-table td {
  font-size: 0.92rem;
  border-top: 1px solid var(--color-border);
  vertical-align: middle;
}

.products-table tbody tr:hover td {
  background-color: rgba(37, 99, 235, 0.05);
}

.thumb {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--color-border);
}

/* ===== 状态标签 ===== */
.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.78rem;
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

/* ===== 无数据提示 ===== */
.no-results {
  text-align: center;
  padding: 16px;
  font-style: italic;
  color: var(--color-text-secondary, #6b7280);
}

/* ===== 分页 ===== */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}
.pagination button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-light, #f3f4f6);
  color: var(--color-text);
  cursor: pointer;
}
.pagination button:disabled {
  cursor: not-allowed;
  background-color: var(--color-disabled, #e5e7eb);
  color: #9ca3af;
}

/* ===== 响应式 ===== */
@media (max-width: 960px) {
  .search-container {
    max-width: 100%;
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

/* ===== 暗黑模式覆盖 ===== */
[data-theme="dark"] .search-input,
.dark .search-input {
  background-color: var(--color-card-bg);
  border-color: var(--color-border);
  color: var(--color-text);
}
[data-theme="dark"] .search-input::placeholder,
.dark .search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

[data-theme="dark"] .products-table {
  background-color: var(--color-card-bg);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}
[data-theme="dark"] .products-table th {
  color: var(--color-table-header-text);
  background-color: var(--color-table-header-bg);
  border-bottom: 2px solid var(--color-table-header-border);
}
[data-theme="dark"] .products-table td {
  color: var(--color-text);
  border-top: 1px solid var(--color-border);
}
[data-theme="dark"] .products-table tbody tr:hover td {
  background-color: rgba(255, 255, 255, 0.08);
}

/* 暗黑模式状态标签高亮 */
[data-theme="dark"] .status-badge.outofstock {
  background-color: rgba(239, 68, 68, 0.25);
  color: #f87171;
}
[data-theme="dark"] .status-badge.discontinued {
  background-color: rgba(107, 114, 128, 0.2);
  color: #f3f4f6;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.15);
}

/* 暗黑模式操作按钮 */
[data-theme="dark"] .action-btn,
.dark .action-btn {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text);
}
[data-theme="dark"] .action-btn:hover,
.dark .action-btn:hover {
  background-color: rgba(37, 99, 235, 0.15);
  color: var(--color-primary);
  border-color: var(--color-primary);
}
[data-theme="dark"] .action-btn.danger,
.dark .action-btn.danger {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.4);
}
[data-theme="dark"] .action-btn.danger:hover,
.dark .action-btn.danger:hover {
  background-color: rgba(248, 113, 113, 0.2);
  color: #f87171;
  border-color: #f87171;
}
</style>
