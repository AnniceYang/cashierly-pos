<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <h2 class="modal-title">
        {{
          customer ? t("customers.editCustomer") : t("customers.addCustomer")
        }}
      </h2>

      <form @submit.prevent="submit" class="modal-form">
        <div class="form-group">
          <label>{{ t("customers.table.name") }}</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter name"
            required
          />
        </div>

        <div class="form-group">
          <label>{{ t("customers.table.email") }}</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            required
          />
        </div>

        <div class="form-group">
          <label>{{ t("customers.table.phone") }}</label>
          <input v-model="form.phone" type="text" placeholder="Enter phone" />
        </div>

        <div class="form-group">
          <label>{{ t("customers.status") }}</label>
          <select v-model="form.active">
            <option :value="true">{{ t("customers.active") }}</option>
            <option :value="false">{{ t("customers.inactive") }}</option>
          </select>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="close">
            {{ t("common.cancel") }}
          </button>
          <button type="submit" class="btn-save">{{ t("common.save") }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";

const { t } = useI18n();

const props = defineProps({
  customer: Object,
});
const emit = defineEmits(["close", "save"]);

const form = ref({ name: "", email: "", phone: "", active: true });

watch(
  () => props.customer,
  (val) => {
    form.value = val
      ? { ...val }
      : { name: "", email: "", phone: "", active: true };
  },
  { immediate: true }
);

function close() {
  emit("close");
}

function submit() {
  emit("save", { ...form.value });
  // 调用 Element Plus 全局提示
  ElMessage.success(
    props.customer
      ? t("customers.updateSuccess") // 编辑成功提示
      : t("customers.addSuccess") // 新增成功提示
  );

  // 可选：提交后自动关闭弹窗
  close();
}
</script>

<style scoped>
/* Modal 外层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 16px;
}

/* 弹窗卡片 */
.modal-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 标题 */
.modal-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
}

/* 表单 */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #444;
}
.form-group input,
.form-group select {
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border, #ddd);
  background-color: var(--color-bg, #fafafa);
  color: var(--color-text, #333);
  font-size: 0.95rem;
}
.form-group input:focus,
.form-group select:focus {
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* 按钮组 */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn-save {
  background-color: var(--color-primary, #3b82f6);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}
.btn-save:hover {
  background-color: var(--color-primary-hover, #2563eb);
}
.btn-cancel {
  background-color: #e5e7eb;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}
.btn-cancel:hover {
  background-color: #d1d5db;
}

/* ========== 暗黑模式 ========== */
[data-theme="dark"] .modal-card {
  background-color: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #e0e0e0;
}
[data-theme="dark"] .modal-title {
  color: #f5f5f5;
}
[data-theme="dark"] .form-group label {
  color: #ccc;
}
[data-theme="dark"] .form-group input,
[data-theme="dark"] .form-group select {
  background-color: #2a2a2a;
  border-color: #444;
  color: #e0e0e0;
}
[data-theme="dark"] .form-group input:focus,
[data-theme="dark"] .form-group select:focus {
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}
[data-theme="dark"] .btn-cancel {
  background-color: #2d2d2d;
  color: #eee;
}
[data-theme="dark"] .btn-cancel:hover {
  background-color: #3a3a3a;
}
</style>
