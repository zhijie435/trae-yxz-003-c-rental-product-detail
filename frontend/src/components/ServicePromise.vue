<template>
  <div class="service-promise">
    <div class="promise-grid">
      <div
        v-for="(promise, index) in promises"
        :key="index"
        class="promise-card"
        :class="{ 'highlight': promise.highlight }"
      >
        <div class="promise-icon">
          <component :is="promise.icon" />
        </div>
        <div class="promise-content">
          <h4 class="promise-title">{{ promise.title }}</h4>
          <p class="promise-description">{{ promise.description }}</p>
        </div>
        <div v-if="promise.badge" class="promise-badge">
          {{ promise.badge }}
        </div>
      </div>
    </div>

    <div v-if="showDetails" class="promise-details">
      <div
        v-for="(detail, index) in details"
        :key="index"
        class="detail-item"
      >
        <svg class="detail-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span class="detail-text">{{ detail }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

defineProps({
  showDetails: {
    type: Boolean,
    default: false
  },
  details: {
    type: Array,
    default: () => []
  }
})

const ShieldIcon = () => h('svg', {
  width: 32,
  height: 32,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }),
  h('path', { d: 'M9 12l2 2 4-4' })
])

const TruckIcon = () => h('svg', {
  width: 32,
  height: 32,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('rect', { x: 1, y: 3, width: 15, height: 13 }),
  h('polygon', { points: '16 8 20 8 23 11 23 16 16 16 16 8' }),
  h('circle', { cx: 5.5, cy: 18.5, r: 2.5 }),
  h('circle', { cx: 18.5, cy: 18.5, r: 2.5 })
])

const LightningIcon = () => h('svg', {
  width: 32,
  height: 32,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
])

const promises = [
  {
    icon: ShieldIcon,
    title: '租期质保',
    description: '全程质量保障，租期内免费维修',
    badge: '放心租',
    highlight: false
  },
  {
    icon: TruckIcon,
    title: '免费上门取退',
    description: '专业配送团队，上海市内免费服务',
    badge: '零费用',
    highlight: false
  },
  {
    icon: LightningIcon,
    title: '故障极速响应',
    description: '24小时客服在线，48小时内上门处理',
    badge: '急速达',
    highlight: true
  }
]
</script>

<style scoped>
.service-promise {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.promise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.promise-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  text-align: center;
  gap: 16px;
}

.promise-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent);
}

.promise-card.highlight {
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.05) 0%, rgba(201, 169, 98, 0.1) 100%);
  border-color: var(--color-accent);
}

.promise-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.1) 0%, rgba(201, 169, 98, 0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  transition: all var(--transition-fast);
}

.promise-card:hover .promise-icon {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  color: #fff;
  transform: scale(1.1);
}

.promise-card.highlight .promise-icon {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  color: #fff;
}

.promise-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.promise-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.promise-description {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.promise-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  padding: 4px 12px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(201, 169, 98, 0.4);
}

.promise-card.highlight .promise-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.promise-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #faf9f6 0%, #f5f4f0 100%);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--color-text);
}

.detail-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.detail-text {
  line-height: 1.6;
}

@media (max-width: 768px) {
  .promise-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .promise-card {
    flex-direction: row;
    text-align: left;
    padding: 20px;
    gap: 16px;
  }

  .promise-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
  }

  .promise-badge {
    position: static;
    margin-top: auto;
    align-self: flex-start;
  }

  .promise-content {
    flex: 1;
  }

  .promise-details {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .promise-card {
    padding: 16px;
    gap: 12px;
  }

  .promise-icon {
    width: 44px;
    height: 44px;
  }

  .promise-title {
    font-size: 15px;
  }

  .promise-description {
    font-size: 12px;
  }
}
</style>
