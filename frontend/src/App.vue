<template>
  <div class="app-container">
    <header class="page-header">
      <h1 class="page-title">商品详情</h1>
      <p class="page-subtitle">租赁商品媒体展示</p>
    </header>

    <main class="product-section">
      <div class="product-grid">
        <div class="media-column">
          <MediaGallery
            :product-id="productId"
            :initial-media="demoMedia"
            @media-uploaded="handleMediaUploaded"
            @media-error="handleMediaError"
          />
        </div>

        <div class="info-column">
          <div class="product-info">
            <div class="product-badge">租赁商品</div>
            <h2 class="product-name">设计师款北欧风沙发</h2>
            <p class="product-desc">
              简约现代设计，优质棉麻面料，高密度海绵填充，舒适耐用。适合客厅、书房等多种场景。
            </p>
            
            <div class="price-section">
              <div class="rental-price">
                <span class="price-label">租金</span>
                <span class="price-value">¥199</span>
                <span class="price-unit">/月</span>
              </div>
              <div class="deposit">
                <span class="deposit-label">押金</span>
                <span class="deposit-value">¥800</span>
              </div>
            </div>

            <div class="specs-section">
              <h3 class="specs-title">商品规格</h3>
              <div class="specs-grid">
                <div class="spec-item">
                  <span class="spec-label">尺寸</span>
                  <span class="spec-value">200×90×85cm</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">材质</span>
                  <span class="spec-value">棉麻/实木</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">颜色</span>
                  <span class="spec-value">米白色</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">租期</span>
                  <span class="spec-value">3-12个月</span>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <button class="btn-primary">立即租赁</button>
              <button class="btn-secondary">加入收藏</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import MediaGallery from './components/MediaGallery.vue'

const productId = ref('product-001')

const demoMedia = ref([
  {
    id: 'img-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    alt: '沙发正面展示'
  },
  {
    id: 'img-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    alt: '沙发侧面展示'
  },
  {
    id: 'img-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    alt: '沙发细节展示'
  }
])

const notification = reactive({
  show: false,
  message: '',
  type: 'success'
})

const showNotification = (message, type = 'success') => {
  notification.message = message
  notification.type = type
  notification.show = true
  setTimeout(() => {
    notification.show = false
  }, 3000)
}

const handleMediaUploaded = ({ media }) => {
  showNotification('视频上传成功！', 'success')
}

const handleMediaError = ({ message }) => {
  showNotification(message, 'error')
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: var(--color-text-muted);
  font-weight: 300;
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.product-info {
  padding: 32px 0;
}

.product-badge {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.product-name {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 16px;
  line-height: 1.3;
}

.product-desc {
  font-size: 15px;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 32px;
}

.price-section {
  display: flex;
  gap: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #faf9f6 0%, #f5f4f0 100%);
  border-radius: var(--radius-md);
  margin-bottom: 32px;
}

.rental-price {
  display: flex;
  flex-direction: column;
}

.price-label,
.deposit-label {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.price-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-display);
}

.price-unit {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-left: 2px;
}

.deposit-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
}

.specs-section {
  margin-bottom: 32px;
}

.specs-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spec-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.spec-value {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.btn-primary {
  flex: 1;
  padding: 16px 32px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #333 100%);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(26, 26, 26, 0.3);
}

.btn-secondary {
  padding: 16px 32px;
  background: transparent;
  color: var(--color-text);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-secondary:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.notification {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 28px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  z-index: 10001;
  animation: slideUp 0.3s ease;
}

.notification.success {
  background: #2d7d46;
  color: #fff;
}

.notification.error {
  background: #c53030;
  color: #fff;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .product-name {
    font-size: 24px;
  }

  .price-section {
    flex-direction: column;
    gap: 16px;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
