<template>
  <div class="order-confirm-page">
    <header class="page-header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 class="page-title">确认订单</h1>
    </header>

    <div class="order-content" v-if="orderData">
      <div class="product-card">
        <div class="product-image">
          <img :src="productImage" :alt="productName" />
        </div>
        <div class="product-info">
          <h2 class="product-name">{{ productName }}</h2>
          <p class="product-brand">{{ productBrand }}</p>
        </div>
      </div>

      <div class="rental-config">
        <h3 class="section-title">租赁配置</h3>
        <div class="config-item">
          <span class="config-label">租期</span>
          <span class="config-value">{{ orderData.labels?.periodLabel || '-' }}</span>
        </div>
        <div class="config-item">
          <span class="config-label">颜色</span>
          <span class="config-value">{{ orderData.labels?.colorName || '-' }}</span>
        </div>
        <div class="config-item">
          <span class="config-label">尺寸</span>
          <span class="config-value">{{ orderData.labels?.sizeName || '-' }}</span>
        </div>
        <div class="config-item">
          <span class="config-label">配送方式</span>
          <span class="config-value">{{ orderData.labels?.deliveryName || '-' }}</span>
        </div>
      </div>

      <div class="pricing-detail">
        <h3 class="section-title">费用明细</h3>
        <div class="price-row">
          <span class="price-label">月租</span>
          <span class="price-value">¥{{ orderData.pricing?.monthlyPrice || 0 }}/月</span>
        </div>
        <div class="price-row">
          <span class="price-label">租金小计</span>
          <span class="price-value">¥{{ orderData.pricing?.subtotal || 0 }}</span>
        </div>
        <div class="price-row">
          <span class="price-label">押金</span>
          <span class="price-value">¥{{ orderData.pricing?.deposit || 0 }}</span>
        </div>
        <div class="price-row" v-if="orderData.pricing?.deliveryFee > 0">
          <span class="price-label">配送费</span>
          <span class="price-value">¥{{ orderData.pricing?.deliveryFee }}</span>
        </div>
        <div class="price-row total">
          <span class="price-label">应付总额</span>
          <span class="price-value accent">¥{{ orderData.pricing?.total || 0 }}</span>
        </div>
      </div>

      <div class="delivery-info">
        <h3 class="section-title">配送信息</h3>
        <div class="info-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <input type="text" placeholder="请输入配送地址" class="info-input" v-model="deliveryAddress" />
        </div>
        <div class="info-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <input type="tel" placeholder="请输入联系电话" class="info-input" v-model="contactPhone" />
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p class="empty-text">订单信息加载失败</p>
      <button class="retry-btn" @click="goBack">返回商品详情</button>
    </div>

    <div class="bottom-bar" v-if="orderData">
      <div class="total-display">
        <span class="total-label">应付总额</span>
        <span class="total-amount">¥{{ orderData.pricing?.total || 0 }}</span>
      </div>
      <button class="submit-btn" @click="submitOrder" :disabled="!canSubmit">
        提交订单
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const productName = ref('设计师款北欧风沙发')
const productBrand = ref('宜家经典')
const productImage = ref('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80')

const deliveryAddress = ref('')
const contactPhone = ref('')

const orderData = ref(null)

const canSubmit = computed(() => {
  return deliveryAddress.value.trim() && contactPhone.value.trim()
})

const goBack = () => {
  router.back()
}

const submitOrder = () => {
  if (!canSubmit.value) {
    alert('请填写完整的配送信息')
    return
  }

  alert('订单提交成功！')
  router.push('/')
}

onMounted(() => {
  if (route.query.orderData) {
    try {
      orderData.value = JSON.parse(decodeURIComponent(route.query.orderData))
    } catch (error) {
      console.error('Failed to parse order data:', error)
    }
  } else if (route.params.orderData) {
    orderData.value = route.params.orderData
  }
})
</script>

<style scoped>
.order-confirm-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding-bottom: 100px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  background: var(--color-bg);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  font-family: var(--font-display);
}

.order-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.product-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  margin-bottom: 24px;
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.product-brand {
  font-size: 14px;
  color: var(--color-text-muted);
}

.rental-config,
.pricing-detail,
.delivery-info {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.config-item,
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.config-item:last-child,
.price-row:last-child {
  border-bottom: none;
}

.config-label,
.price-label {
  font-size: 14px;
  color: var(--color-text-muted);
}

.config-value,
.price-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.price-value.accent {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-accent);
}

.price-row.total {
  margin-top: 12px;
  padding-top: 16px;
  border-top: 2px solid var(--color-border);
  border-bottom: none;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item svg {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.info-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
}

.info-input::placeholder {
  color: var(--color-text-muted);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 24px;
}

.empty-state svg {
  color: var(--color-border);
  margin-bottom: 20px;
}

.empty-text {
  font-size: 16px;
  color: var(--color-text-muted);
  margin-bottom: 20px;
}

.retry-btn {
  padding: 12px 32px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.retry-btn:hover {
  background: var(--color-accent-hover);
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
}

.total-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-accent);
  font-family: var(--font-display);
}

.submit-btn {
  padding: 16px 48px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 12px rgba(201, 169, 98, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(201, 169, 98, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .order-content {
    padding: 16px;
  }

  .product-card {
    padding: 16px;
  }

  .product-image {
    width: 80px;
    height: 80px;
  }

  .product-name {
    font-size: 16px;
  }

  .bottom-bar {
    padding: 12px 16px;
  }

  .submit-btn {
    padding: 14px 32px;
    font-size: 14px;
  }
}
</style>
