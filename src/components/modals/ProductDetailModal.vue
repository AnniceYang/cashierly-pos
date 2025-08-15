<template>
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="product-modal-title"
    @click.self="close"
  >
    <div class="product-modal">
      <!-- Header -->
      <header class="product-modal-header">
        <h2 id="product-modal-title" class="product-modal-title">
          {{ t("products.details") }}
        </h2>
        <button class="close-btn" @click="close" aria-label="Close">×</button>
      </header>

      <!-- Body -->
      <main class="product-modal-body">
        <div class="product-image" @click="previewImage">
          <img
            :src="imageUrl"
            :alt="product?.name || 'Product image'"
            loading="lazy"
          />
        </div>

        <div class="product-details">
          <div class="info-row">
            <label>{{ t("products.name") }}</label>
            <p>{{ product.name }}</p>
          </div>
          <div class="info-row">
            <label>{{ t("products.category") }}</label>
            <p>{{ product.category }}</p>
          </div>
          <div class="info-row">
            <label>{{ t("products.price") }}</label>
            <p>{{ currencyFormat(product.price) }}</p>
          </div>
          <div class="info-row">
            <label>{{ t("products.stock") }}</label>
            <p>{{ product.stock }}</p>
          </div>
          <div class="info-row">
            <label>{{ t("products.status.name") }}</label>
            <p>
              <span
                :class="['status-badge', (product.status || '').toLowerCase()]"
              >
                {{
                  t(`products.status.${(product.status || "").toLowerCase()}`)
                }}
              </span>
            </p>
          </div>
          <div class="info-row">
            <label>{{ t("products.description") }}</label>
            <p class="desc">{{ product.description || "-" }}</p>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="product-modal-footer">
        <button class="btn secondary" @click="close">
          {{ t("common.close") }}
        </button>
      </footer>
    </div>

    <!-- Lightbox 放大图片 -->
    <div
      v-if="showLightbox"
      class="lightbox-overlay"
      @click="showLightbox = false"
    >
      <img :src="imageUrl" class="lightbox-img" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const showLightbox = ref(false);

function previewImage() {
  showLightbox.value = true;
}

const props = defineProps({
  product: { type: Object, required: true },
});

const emit = defineEmits(["close"]);

const productImages = import.meta.glob("@/assets/img/*.jpg", {
  eager: true,
  import: "default",
});

const imageUrl = computed(() => {
  const key = props.product?.image
    ? `/src/assets/img/${props.product.image}`
    : null;
  return (
    (key && productImages[key]) ||
    productImages["/src/assets/img/Product1.jpg"] ||
    ""
  );
});

function close() {
  emit("close");
}

function currencyFormat(v) {
  const n = Number(v);
  return Number.isFinite(n) ? `$${n.toFixed(2)}` : "$0.00";
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  overflow-y: auto;
  padding: 12px;
}

.product-modal {
  width: min(920px, 92vw);
  max-height: 90vh;
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: 16px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeInUp 0.22s ease-out;
}

/* Header */
.product-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-card);
}
.product-modal-title {
  font-size: 1.25rem;
  font-weight: 800;
}
.close-btn {
  border: none;
  background: transparent;
  font-size: 1.6rem;
  cursor: pointer;
  border-radius: 10px;
  padding: 2px 8px;
  color: var(--color-text-secondary);
  transition: 0.15s;
}
.close-btn:hover {
  background: var(--color-hover);
  color: var(--color-accent);
}

/* Body */
.product-modal-body {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  padding: 18px;
  flex: 1;
  overflow-y: auto;
}

.product-image {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  width: 100%;
  cursor: pointer;
}
.product-image img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
}
.info-row label {
  display: block;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  font-weight: 700;
}
.info-row p {
  margin: 0;
  font-size: 0.96rem;
  color: var(--color-text);
}
.info-row .desc {
  white-space: pre-wrap;
  line-height: 1.5;
}

/* 状态胶囊 */
.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 800;
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

/* Footer */
.product-modal-footer {
  padding: 14px 18px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: var(--color-card);
  flex-shrink: 0;
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
  transition: 0.2s;
}
.btn:hover {
  background-color: var(--color-hover);
  box-shadow: 0 0 0 3px var(--color-hover-shadow);
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.lightbox-img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
}

/* 手机适配 */
@media (max-width: 600px) {
  .product-modal-body {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }
  .product-details {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .product-modal {
    width: 92vw;
    max-height: 90vh;
  }
  .product-image {
    width: 100%;
  }
  .product-image img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
}

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
