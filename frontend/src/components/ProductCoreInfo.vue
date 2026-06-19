<template>
  <div class="product-core-info">
    <div class="product-header">
      <div class="product-badge-row">
        <span class="product-badge">租赁商品</span>
        <span class="brand-badge">{{ brand }}</span>
      </div>

      <h1 class="product-name">{{ productName }}</h1>

      <div class="product-meta">
        <div class="meta-item">
          <span class="meta-label">品牌型号</span>
          <span class="meta-value">{{ model }}</span>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-item">
          <span class="meta-label">销量</span>
          <span class="meta-value sales">{{ salesCount }}</span>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-item">
          <span class="meta-label">好评率</span>
          <span class="meta-value rating">{{ rating }}</span>
        </div>
      </div>
    </div>

    <div class="reviews-highlight">
      <div class="reviews-header">
        <h3 class="reviews-title">图文好评</h3>
        <span class="reviews-count">{{ reviews.length }}条评价</span>
      </div>

      <div class="reviews-list">
        <div
          v-for="review in displayedReviews"
          :key="review.id"
          class="review-card"
        >
          <div class="review-header">
            <div class="reviewer-info">
              <img
                v-if="review.avatar"
                :src="review.avatar"
                :alt="review.reviewerName"
                class="reviewer-avatar"
              />
              <div v-else class="reviewer-avatar-placeholder">
                {{ review.reviewerName.charAt(0) }}
              </div>
              <div class="reviewer-details">
                <span class="reviewer-name">{{ review.reviewerName }}</span>
                <div class="review-tags">
                  <span
                    v-for="(tag, index) in review.tags"
                    :key="index"
                    class="review-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            <div class="review-rating">
              <div class="stars">
                <svg
                  v-for="star in 5"
                  :key="star"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  :fill="star <= review.rating ? 'var(--color-accent)' : 'var(--color-border)'"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span class="review-date">{{ review.date }}</span>
            </div>
          </div>

          <p class="review-content">{{ review.content }}</p>

          <div v-if="review.images && review.images.length > 0" class="review-images">
            <img
              v-for="(image, imgIndex) in review.images"
              :key="imgIndex"
              :src="image"
              :alt="`评价图片 ${imgIndex + 1}`"
              class="review-image"
              @click="openImagePreview(image)"
            />
          </div>
        </div>
      </div>

      <button
        v-if="reviews.length > displayLimit"
        class="view-more-btn"
        @click="toggleShowAll"
      >
        {{ showAll ? '收起' : `查看全部 ${reviews.length} 条评价` }}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="{ 'rotate': showAll }"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <transition name="fade">
        <div v-if="previewImage" class="image-preview-overlay" @click="closePreview">
          <div class="image-preview-content" @click.stop>
            <button class="preview-close-btn" @click="closePreview">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img :src="previewImage" alt="预览图片" class="preview-image" />
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  productName: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    default: '高端品牌'
  },
  model: {
    type: String,
    required: true
  },
  salesCount: {
    type: [String, Number],
    default: '0'
  },
  rating: {
    type: String,
    default: '0%'
  },
  reviews: {
    type: Array,
    default: () => []
  },
  displayLimit: {
    type: Number,
    default: 2
  }
})

const showAll = ref(false)
const previewImage = ref(null)

const displayedReviews = computed(() => {
  if (showAll.value) {
    return props.reviews
  }
  return props.reviews.slice(0, props.displayLimit)
})

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

const openImagePreview = (image) => {
  previewImage.value = image
  document.body.style.overflow = 'hidden'
}

const closePreview = () => {
  previewImage.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
.product-core-info {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-badge-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.product-badge {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.brand-badge {
  display: inline-block;
  padding: 6px 16px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  letter-spacing: 0.5px;
}

.product-name {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #faf9f6 0%, #f5f4f0 100%);
  border-radius: var(--radius-md);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-label {
  font-size: 12px;
  color: var(--color-text-muted);
  font-weight: 400;
}

.meta-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.meta-value.sales {
  color: var(--color-primary);
}

.meta-value.rating {
  color: var(--color-accent);
}

.meta-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
}

.reviews-highlight {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reviews-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
}

.reviews-count {
  font-size: 14px;
  color: var(--color-text-muted);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  padding: 20px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.review-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-avatar,
.reviewer-avatar-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.reviewer-avatar-placeholder {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reviewer-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.review-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.review-tag {
  padding: 4px 10px;
  background: rgba(201, 169, 98, 0.1);
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
  border: 1px solid rgba(201, 169, 98, 0.2);
}

.review-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.stars {
  display: flex;
  gap: 3px;
}

.review-date {
  font-size: 12px;
  color: var(--color-text-muted);
}

.review-content {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.8;
  margin-bottom: 14px;
}

.review-images {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.review-images::-webkit-scrollbar {
  height: 4px;
}

.review-images::-webkit-scrollbar-track {
  background: var(--color-border);
  border-radius: 2px;
}

.review-images::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 2px;
}

.review-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.review-image:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.view-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: transparent;
  color: var(--color-accent);
  border: 1.5px solid var(--color-accent);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.view-more-btn:hover {
  background: rgba(201, 169, 98, 0.05);
  transform: translateY(-2px);
}

.view-more-btn svg {
  transition: transform var(--transition-fast);
}

.view-more-btn svg.rotate {
  transform: rotate(180deg);
}

.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.image-preview-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.preview-close-btn {
  position: absolute;
  top: -50px;
  right: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all var(--transition-fast);
}

.preview-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.preview-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .product-name {
    font-size: 28px;
  }

  .product-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .meta-divider {
    width: 100%;
    height: 1px;
  }

  .review-header {
    flex-direction: column;
    gap: 12px;
  }

  .review-rating {
    align-items: flex-start;
    width: 100%;
    justify-content: space-between;
    flex-direction: row;
  }

  .reviewer-avatar,
  .reviewer-avatar-placeholder {
    width: 40px;
    height: 40px;
  }
}
</style>
