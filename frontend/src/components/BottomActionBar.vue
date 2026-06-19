<template>
  <div class="bottom-action-bar" :class="{ 'with-safe-area': showSafeArea }">
    <div class="bar-content">
      <div class="quick-actions">
        <button class="action-item" @click="handleCustomerService">
          <div class="action-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span v-if="unreadMessages > 0" class="badge">{{ unreadMessages > 99 ? '99+' : unreadMessages }}</span>
          </div>
          <span class="action-label">客服</span>
        </button>

        <button class="action-item" @click="handleFavorite">
          <div class="action-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              :fill="isFavorited ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <span class="action-label">{{ isFavorited ? '已收藏' : '收藏' }}</span>
        </button>

        <button class="action-item cart" @click="handleAddToCart">
          <div class="action-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span v-if="cartCount > 0" class="badge">{{ cartCount > 99 ? '99+' : cartCount }}</span>
          </div>
          <span class="action-label">购物车</span>
        </button>
      </div>

      <div class="price-info">
        <div class="price-row">
          <span class="price-label">月租</span>
          <span class="price-value">¥{{ monthlyPrice }}</span>
        </div>
        <div class="price-row total">
          <span class="price-label">应付总额</span>
          <span class="price-value accent">¥{{ totalAmount }}</span>
        </div>
      </div>

      <div class="main-actions">
        <button class="btn-cart" @click="handleAddToCart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span>加入购物车</span>
        </button>

        <button class="btn-rent" @click="handleRent">
          <span class="rent-text">立即租赁</span>
          <span class="rent-price">¥{{ totalAmount }}</span>
        </button>
      </div>
    </div>

    <Transition name="slide-up">
      <div v-if="showTooltip" class="tooltip">
        <div class="tooltip-content">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ tooltipMessage }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  monthlyPrice: {
    type: [Number, String],
    default: 0
  },
  totalAmount: {
    type: [Number, String],
    default: 0
  },
  cartCount: {
    type: Number,
    default: 0
  },
  unreadMessages: {
    type: Number,
    default: 0
  },
  showSafeArea: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['customer-service', 'favorite', 'add-to-cart', 'rent'])

const isFavorited = ref(false)
const showTooltip = ref(false)
const tooltipMessage = ref('')

const handleCustomerService = () => {
  emit('customer-service')
  showTooltipWithMessage('正在连接客服...')
}

const handleFavorite = () => {
  isFavorited.value = !isFavorited.value
  emit('favorite', isFavorited.value)
  showTooltipWithMessage(isFavorited.value ? '已添加到收藏' : '已取消收藏')
}

const handleAddToCart = () => {
  emit('add-to-cart')
  showTooltipWithMessage('已加入购物车')
}

const handleRent = () => {
  emit('rent')
}

const showTooltipWithMessage = (message) => {
  tooltipMessage.value = message
  showTooltip.value = true
  setTimeout(() => {
    showTooltip.value = false
  }, 2000)
}
</script>

<style scoped>
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.bar-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.quick-actions {
  display: flex;
  gap: 8px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  border-radius: var(--radius-sm);
  position: relative;
}

.action-item:hover {
  background: var(--color-bg);
}

.action-item:active {
  transform: scale(0.95);
}

.action-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  transition: color var(--transition-fast);
}

.action-item:hover .action-icon {
  color: var(--color-accent);
}

.action-item.cart .action-icon,
.action-item:active .action-icon {
  color: var(--color-primary);
}

.badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #ff4757;
  color: #fff;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  animation: badgePop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes badgePop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.action-label {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
  white-space: nowrap;
}

.action-item:hover .action-label {
  color: var(--color-accent);
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px;
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.price-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  font-family: var(--font-display);
}

.price-value.accent {
  font-size: 20px;
  color: var(--color-accent);
}

.main-actions {
  display: flex;
  gap: 12px;
}

.btn-cart {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--color-surface);
  border: 2px solid var(--color-accent);
  border-radius: var(--radius-sm);
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-cart:hover {
  background: rgba(201, 169, 98, 0.1);
  transform: translateY(-2px);
}

.btn-cart:active {
  transform: translateY(0);
}

.btn-rent {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  border: none;
  border-radius: var(--radius-sm);
  color: #fff;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 12px rgba(201, 169, 98, 0.3);
}

.btn-rent:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(201, 169, 98, 0.4);
}

.btn-rent:active {
  transform: translateY(0);
}

.rent-text {
  font-size: 14px;
  font-weight: 600;
}

.rent-price {
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-display);
}

.tooltip {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
}

.tooltip-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 20px;
  font-size: 13px;
  white-space: nowrap;
  backdrop-filter: blur(8px);
}

.tooltip-content svg {
  color: #4ade80;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

@media (max-width: 768px) {
  .bar-content {
    grid-template-columns: auto 1fr;
    gap: 12px;
    padding: 10px 12px;
  }

  .quick-actions {
    gap: 4px;
  }

  .action-item {
    padding: 6px 10px;
  }

  .action-label {
    font-size: 10px;
  }

  .price-info {
    display: none;
  }

  .main-actions {
    flex: 1;
    gap: 8px;
  }

  .btn-cart {
    padding: 12px 16px;
    flex: 1;
    justify-content: center;
  }

  .btn-rent {
    flex: 2;
    padding: 12px 20px;
  }
}

@media (max-width: 480px) {
  .action-item:not(:first-child):not(:nth-child(2)) {
    display: none;
  }

  .btn-cart span {
    display: none;
  }

  .btn-cart {
    padding: 12px;
  }

  .btn-cart svg {
    width: 22px;
    height: 22px;
  }
}

.with-safe-area {
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
}
</style>
