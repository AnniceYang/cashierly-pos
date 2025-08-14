<template>
  <div
    class="modal-overlay"
    @click.self="close"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-container">
      <header class="modal-header">
        <h2>
          {{ isEdit ? t("products.edit") : t("products.add") }}
        </h2>
        <button class="clost-btn" @click="close" aria-label="Close">x</button>
      </header>

      <main class="modal-body">
        <form @submit.prevent="saveProduct" class="form-grid">
          <label>{{ t("products.name") }}</label>
          <input v-model="localProduct.name" type="text" required />

          <label>{{ t("products.category") }}</label>
          <input v-model="localProduct.category" type="text" required />

          <label>{{ t("products.price") }}</label>
          <input v-model="localProduct.price" type="text" required />

          <label>{{ t("products.stock") }}</label>
          <input v-model="localProduct.stock" type="text" required />

          <label>{{ t("products.description") }}</label>
          <input v-model="localProduct.description" type="text" required />

          <label>{{ t("products.uploadImage") }}</label>
        </form>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
