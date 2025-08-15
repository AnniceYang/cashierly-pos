<!-- EditProductModal.vue -->
<template>
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    @click.self="close"
  >
    <div class="modal-container">
      <!-- Header -->
      <header class="modal-header">
        <h2 class="modal-title">
          {{ isEdit ? t("products.edit") : t("products.add") }}
        </h2>
        <button class="close-btn" @click="close" aria-label="Close">×</button>
      </header>

      <!-- Body -->
      <main class="modal-body">
        <form @submit.prevent="saveProduct" class="form-grid">
          <div class="form-group">
            <label>{{ t("products.name") }}</label>
            <input v-model="localProduct.name" type="text" required />
          </div>

          <div class="form-group">
            <label>{{ t("products.category") }}</label>
            <input v-model="localProduct.category" type="text" required />
          </div>

          <div class="form-group">
            <label>{{ t("products.price") }}</label>
            <input
              v-model.number="localProduct.price"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="form-group">
            <label>{{ t("products.stock") }}</label>
            <input
              v-model.number="localProduct.stock"
              type="number"
              min="0"
              required
            />
          </div>

          <div class="form-group full-width">
            <label>{{ t("products.description") }}</label>
            <textarea v-model="localProduct.description" rows="3"></textarea>
          </div>

          <div class="form-group full-width">
            <label>{{ t("products.uploadImage") }}</label>
            <input type="file" @change="onImageUpload" />
          </div>
        </form>
      </main>

      <!-- Footer -->
      <footer class="modal-footer">
        <button type="button" class="btn secondary" @click="close">
          {{ t("common.cancel") }}
        </button>
        <button type="button" class="btn primary" @click="saveProduct">
          {{ t("common.save") }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  product: { type: Object, default: () => ({}) },
  isEdit: { type: Boolean, default: false },
});
const emit = defineEmits(["close", "save"]);

const localProduct = ref({
  name: "",
  category: "",
  price: 0,
  stock: 0,
  description: "",
  image: "",
});
watch(
  () => props.product,
  (newVal) => {
    if (props.isEdit && newVal && Object.keys(newVal).length) {
      // 编辑模式：使用传入的商品数据
      localProduct.value = { ...newVal };
    } else {
      // 添加模式：空白表单
      localProduct.value = {
        name: "",
        category: "",
        price: 0,
        stock: 0,
        description: "",
        image: "",
      };
    }
  },
  { immediate: true }
);
function close() {
  emit("close");
}

function saveProduct() {
  emit("save", { ...localProduct.value });
}

function onImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    localProduct.value.image = file.name;
  }
}
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* Container */
.modal-container {
  width: min(600px, 92vw);
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: 16px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: fadeInUp 0.22s ease-out;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}
.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
}
.close-btn {
  border: none;
  background: transparent;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 10px;
  padding: 2px 8px;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.close-btn:hover {
  background: rgba(37, 99, 235, 0.1);
  color: var(--color-primary);
}

/* Body */
.modal-body {
  padding: 18px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group.full-width {
  grid-column: 1 / -1;
}
label {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  font-weight: 700;
  margin-bottom: 6px;
}
input,
textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-light);
  color: var(--color-text);
  font-size: 0.92rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

/* Footer */
.modal-footer {
  padding: 14px 18px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: var(--color-bg);
}
.btn {
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: var(--color-light);
  color: var(--color-text);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.btn:hover {
  background-color: rgba(37, 99, 235, 0.08);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.btn.primary {
  background: var(--color-primary);
  color: #fff;
}
.btn.primary:hover {
  background: #1e4fd6;
}

/* Dark mode */
[data-theme="dark"] .modal-container,
[data-theme="dark"] .modal-header,
[data-theme="dark"] .modal-footer {
  background-color: var(--color-bg);
  color: var(--color-text);
  border-color: var(--color-border);
}
[data-theme="dark"] input,
[data-theme="dark"] textarea {
  background-color: var(--color-bg);
  border-color: var(--color-border);
  color: var(--color-text);
}
[data-theme="dark"] label {
  color: var(--color-text-secondary);
}
[data-theme="dark"] .btn {
  background: var(--color-light);
  border-color: var(--color-border);
  color: var(--color-text);
}
[data-theme="dark"] .btn.primary {
  background: var(--color-primary);
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
