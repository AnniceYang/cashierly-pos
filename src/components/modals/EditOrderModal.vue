<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <!-- 头部 -->
      <div class="modal-header">
        <h2>{{ t("common.updateOrder") }}</h2>
        <button class="close-btn" @click="close" aria-label="Close">×</button>
      </div>

      <!-- 主体 -->
      <div class="modal-body">
        <form @submit.prevent="save" class="edit-form">
          <label>
            {{ t("dashboard.table.customer") }}
            <input
              v-model="form.customer"
              type="text"
              required
              class="form-input"
            />
          </label>

          <label>
            {{ t("dashboard.table.status") }}
            <select v-model="form.status" class="form-select">
              <option value="completed">
                {{ t("dashboard.statusTooltip.completed") }}
              </option>
              <option value="pending">
                {{ t("dashboard.statusTooltip.pending") }}
              </option>
              <option value="processing">
                {{ t("dashboard.statusTooltip.processing") }}
              </option>
              <option value="cancelled">
                {{ t("dashboard.statusTooltip.cancelled") }}
              </option>
            </select>
          </label>

          <label>
            {{ t("common.notes") }}
            <textarea
              v-model="form.notes"
              placeholder="Optional"
              class="form-textarea"
            ></textarea>
          </label>
        </form>
      </div>

      <!-- 底部按钮 -->
      <div class="modal-footer">
        <button type="button" @click="close" class="cancel-btn">
          {{ t("common.cancel") }}
        </button>
        <button type="submit" @click="save" class="save-btn">
          {{ t("common.update") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  order: Object,
});
const emit = defineEmits(["close", "save"]);

const form = ref({ ...props.order });

const close = () => emit("close");
const save = () => {
  emit("save", form.value);
  close();
};
</script>

<style scoped>
/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 容器 */
.modal-container {
  background-color: var(--color-bg);
  padding: 24px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* 头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h2 {
  font-size: 1.5rem;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text);
}

/* 主体表单 */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  color: var(--color-text);
}

.form-input,
.form-select,
.form-textarea {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  font-size: 1rem;
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  outline: none;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 底部按钮 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn,
.save-btn {
  padding: 8px 16px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.cancel-btn {
  background-color: var(--color-border);
  color: var(--color-text);
}

.cancel-btn:hover {
  background-color: #ccc;
}

.save-btn {
  background-color: var(--color-primary);
  color: white;
}

.save-btn:hover {
  background-color: var(--color-primary-hover);
}

/* 暗黑模式适配 */
[data-theme="dark"] .modal-container {
  background-color: #1f1f1f;
}

[data-theme="dark"] .close-btn {
  color: #fff;
}

[data-theme="dark"] .cancel-btn {
  background-color: #3a3a3a;
  color: #fff;
  border: 1px solid #555;
}

[data-theme="dark"] .cancel-btn:hover {
  background-color: #555;
  color: #fff; /* 保持白色高亮 */
  border-color: #777;
}
</style>
