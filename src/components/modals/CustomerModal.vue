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
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
  overflow-y: auto;
}

.modal-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

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

.form-group input,
.form-group select {
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  background-color: #e5e7eb;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}

.btn-save {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}

@media (max-width: 480px) {
  .modal-card {
    width: 100%;
    padding: 16px;
  }
}
</style>
