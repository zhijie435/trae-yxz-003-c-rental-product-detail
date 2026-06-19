<template>
  <div class="specification-selector">
    <div class="selector-section">
      <h3 class="section-title">
        <span class="section-icon">📅</span>
        选择租期
      </h3>
      <div class="rental-period-options">
        <button
          v-for="period in rentalPeriods"
          :key="period.months"
          class="period-btn"
          :class="{ active: selectedPeriod === period.months }"
          @click="selectPeriod(period.months)"
        >
          <span class="period-months">{{ period.months }}个月</span>
          <span class="period-price">¥{{ period.price }}/月</span>
          <span v-if="period.discount" class="period-discount">省{{ period.discount }}%</span>
        </button>
      </div>
      <p class="selection-hint">租期越长，月租越优惠</p>
    </div>

    <div class="selector-section">
      <h3 class="section-title">
        <span class="section-icon">🎨</span>
        选择规格
      </h3>
      <div class="spec-options">
        <div class="spec-group">
          <label class="spec-label">颜色</label>
          <div class="color-options">
            <button
              v-for="color in colors"
              :key="color.value"
              class="color-btn"
              :class="{ active: selectedColor === color.value }"
              :style="{ backgroundColor: color.hex }"
              @click="selectColor(color.value)"
              :title="color.name"
            >
              <span v-if="selectedColor === color.value" class="color-check">✓</span>
            </button>
          </div>
          <span class="selected-spec-name">{{ getColorName(selectedColor) }}</span>
        </div>

        <div class="spec-group">
          <label class="spec-label">尺寸</label>
          <div class="size-options">
            <button
              v-for="size in sizes"
              :key="size.value"
              class="size-btn"
              :class="{ active: selectedSize === size.value }"
              @click="selectSize(size.value)"
            >
              <span class="size-name">{{ size.name }}</span>
              <span class="size-price">{{ size.priceChange > 0 ? '+' : '' }}{{ size.priceChange !== 0 ? '¥' + size.priceChange : '基准价' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="selector-section">
      <h3 class="section-title">
        <span class="section-icon">🚚</span>
        配送方式
      </h3>
      <div class="delivery-options">
        <button
          v-for="method in deliveryMethods"
          :key="method.value"
          class="delivery-btn"
          :class="{ active: selectedDelivery === method.value }"
          @click="selectDelivery(method.value)"
        >
          <span class="delivery-icon">{{ method.icon }}</span>
          <div class="delivery-info">
            <span class="delivery-name">{{ method.name }}</span>
            <span class="delivery-desc">{{ method.description }}</span>
          </div>
          <span class="delivery-fee">{{ method.fee === 0 ? '免费' : '¥' + method.fee }}</span>
        </button>
      </div>
    </div>

    <div class="price-breakdown">
      <h3 class="breakdown-title">
        <span class="breakdown-icon">💰</span>
        费用明细
      </h3>
      <div class="breakdown-list">
        <div class="breakdown-item">
          <span class="item-label">月租费</span>
          <span class="item-value">¥{{ currentPeriodPrice }} × {{ selectedPeriod }}个月</span>
        </div>
        <div class="breakdown-item">
          <span class="item-label">租金小计</span>
          <span class="item-value">¥{{ rentalSubtotal }}</span>
        </div>
        <div class="breakdown-item">
          <span class="item-label">押金</span>
          <span class="item-value">¥{{ calculatedDeposit }}</span>
        </div>
        <div class="breakdown-item">
          <span class="item-label">配送费</span>
          <span class="item-value">{{ currentDeliveryFee === 0 ? '免费' : '¥' + currentDeliveryFee }}</span>
        </div>
        <div class="breakdown-divider"></div>
        <div class="breakdown-item total">
          <span class="item-label">应付总额</span>
          <span class="item-value">¥{{ totalAmount }}</span>
        </div>
        <div class="breakdown-item deposit-note">
          <span class="item-label">押金说明</span>
          <span class="item-value note">租期结束退款 ¥{{ calculatedDeposit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  basePrice: {
    type: Number,
    default: 199
  },
  baseDeposit: {
    type: Number,
    default: 800
  }
})

const emit = defineEmits(['update:selection'])

const rentalPeriods = [
  { months: 3, price: 199, discount: 0 },
  { months: 6, price: 189, discount: 5 },
  { months: 12, price: 169, discount: 15 }
]

const colors = [
  { value: 'white', name: '米白色', hex: '#f5f5dc' },
  { value: 'gray', name: '高级灰', hex: '#808080' },
  { value: 'brown', name: '咖啡棕', hex: '#8b4513' },
  { value: 'blue', name: '深海蓝', hex: '#4682b4' }
]

const sizes = [
  { value: 'small', name: '小款 180×80cm', priceChange: -100 },
  { value: 'medium', name: '中款 200×90cm', priceChange: 0 },
  { value: 'large', name: '大款 220×100cm', priceChange: 150 }
]

const deliveryMethods = [
  {
    value: 'pickup',
    name: '门店自提',
    description: '到指定门店取货',
    fee: 0,
    icon: '🏪'
  },
  {
    value: 'delivery',
    name: '送货上门',
    description: '免费送货到楼下',
    fee: 0,
    icon: '🚚'
  },
  {
    value: 'install',
    name: '安装配送',
    description: '送货+专业安装',
    fee: 150,
    icon: '🔧'
  }
]

const selectedPeriod = ref(6)
const selectedColor = ref('white')
const selectedSize = ref('medium')
const selectedDelivery = ref('delivery')

const currentPeriodPrice = computed(() => {
  const period = rentalPeriods.find(p => p.months === selectedPeriod.value)
  return period ? period.price : props.basePrice
})

const sizePriceMultiplier = computed(() => {
  const size = sizes.find(s => s.value === selectedSize.value)
  return size ? size.priceChange : 0
})

const calculatedDeposit = computed(() => {
  const baseDeposit = props.baseDeposit
  const sizeAdjustment = sizePriceMultiplier.value
  return Math.max(500, baseDeposit + sizeAdjustment)
})

const rentalSubtotal = computed(() => {
  return currentPeriodPrice.value * selectedPeriod.value
})

const currentDeliveryFee = computed(() => {
  const method = deliveryMethods.find(m => m.value === selectedDelivery.value)
  return method ? method.fee : 0
})

const totalAmount = computed(() => {
  return rentalSubtotal.value + calculatedDeposit.value + currentDeliveryFee.value
})

const selectPeriod = (months) => {
  selectedPeriod.value = months
  updateSelection()
}

const selectColor = (color) => {
  selectedColor.value = color
  updateSelection()
}

const selectSize = (size) => {
  selectedSize.value = size
  updateSelection()
}

const selectDelivery = (delivery) => {
  selectedDelivery.value = delivery
  updateSelection()
}

const getColorName = (colorValue) => {
  const color = colors.find(c => c.value === colorValue)
  return color ? color.name : ''
}

const updateSelection = () => {
  const selection = {
    period: selectedPeriod.value,
    color: selectedColor.value,
    colorName: getColorName(selectedColor.value),
    size: selectedSize.value,
    delivery: selectedDelivery.value,
    monthlyPrice: currentPeriodPrice.value,
    deposit: calculatedDeposit.value,
    deliveryFee: currentDeliveryFee.value,
    totalAmount: totalAmount.value,
    rentalSubtotal: rentalSubtotal.value
  }
  emit('update:selection', selection)
}

watch([selectedPeriod, selectedColor, selectedSize, selectedDelivery], () => {
  updateSelection()
}, { immediate: true })
</script>

<style scoped>
.specification-selector {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.selector-section {
  margin-bottom: 32px;
}

.selector-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 20px;
}

.selection-hint {
  font-size: 12px;
  color: #999;
  margin-top: 12px;
  text-align: center;
}

.rental-period-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.period-btn {
  position: relative;
  padding: 16px 12px;
  background: #f8f8f8;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.period-btn:hover {
  background: #f0f0f0;
  border-color: #e0e0e0;
}

.period-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.period-months {
  font-size: 16px;
  font-weight: 600;
}

.period-price {
  font-size: 14px;
  opacity: 0.9;
}

.period-discount {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.spec-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.spec-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spec-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.color-options {
  display: flex;
  gap: 12px;
}

.color-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.color-btn.active {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.color-check {
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.selected-spec-name {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.size-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.size-btn {
  padding: 14px 10px;
  background: #f8f8f8;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.size-btn:hover {
  background: #f0f0f0;
  border-color: #e0e0e0;
}

.size-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.size-name {
  font-size: 13px;
  font-weight: 500;
}

.size-price {
  font-size: 11px;
  opacity: 0.8;
}

.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.delivery-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #f8f8f8;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.delivery-btn:hover {
  background: #f0f0f0;
  border-color: #e0e0e0;
}

.delivery-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.delivery-icon {
  font-size: 28px;
}

.delivery-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.delivery-name {
  font-size: 15px;
  font-weight: 600;
}

.delivery-desc {
  font-size: 12px;
  opacity: 0.8;
}

.delivery-fee {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.delivery-btn.active .delivery-fee {
  color: white;
}

.price-breakdown {
  background: linear-gradient(135deg, #faf9f6 0%, #f5f4f0 100%);
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
}

.breakdown-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breakdown-icon {
  font-size: 20px;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.item-label {
  color: #666;
}

.item-value {
  color: #1a1a1a;
  font-weight: 500;
}

.breakdown-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 8px 0;
}

.breakdown-item.total {
  font-size: 18px;
}

.breakdown-item.total .item-label {
  font-weight: 600;
  color: #1a1a1a;
}

.breakdown-item.total .item-value {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.breakdown-item.deposit-note {
  padding-top: 12px;
  border-top: 1px dashed #e0e0e0;
}

.deposit-note .item-label {
  font-size: 12px;
  color: #999;
}

.deposit-note .item-value {
  font-size: 12px;
  color: #52c41a;
}

@media (max-width: 768px) {
  .rental-period-options {
    grid-template-columns: 1fr;
  }

  .size-options {
    grid-template-columns: 1fr;
  }

  .color-options {
    flex-wrap: wrap;
  }

  .delivery-options {
    gap: 8px;
  }

  .delivery-btn {
    padding: 12px;
  }
}
</style>
