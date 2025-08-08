<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ t("common.orderDetails") }}</h2>
        <button class="close-btn" @click="closeModal" aria-label="Close">
          ×
        </button>
      </div>
      <div class="modal-body">
        <table class="order-details-table">
          <tbody>
            <tr>
              <th>{{ t("dashboard.table.id") }}</th>
              <td>{{ order.id }}</td>
            </tr>
            <tr>
              <th>{{ t("dashboard.table.date") }}</th>
              <td>{{ order.date }}</td>
            </tr>
            <tr>
              <th>{{ t("dashboard.table.customer") }}</th>
              <td>{{ order.customer }}</td>
            </tr>
            <tr>
              <th>{{ t("dashboard.table.items") }}</th>
              <td>{{ order.items }}</td>
            </tr>
            <tr>
              <th>{{ t("dashboard.table.total") }}</th>
              <td>{{ order.total }}</td>
            </tr>
            <tr>
              <th>{{ t("dashboard.table.status") }}</th>
              <td>{{ order.status }}</td>
            </tr>
            <tr>
              <th>{{ t("common.notes") }}</th>
              <td>{{ order.notes || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button @click="closeModal" class="cancel-btn">
          {{ t("common.close") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const { t } = useI18n();

// 关闭弹窗
const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
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
  z-index: 999;
}

.modal-container {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

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
  color: #333;
}

.modal-body {
  margin-bottom: 20px;
}

.order-details-table {
  width: 100%;
  border-collapse: collapse;
}

.order-details-table th,
.order-details-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.order-details-table th {
  font-weight: bold;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover,
.cancel-btn:focus-visible {
  background-color: var(--color-primary-hover);
}
</style>
