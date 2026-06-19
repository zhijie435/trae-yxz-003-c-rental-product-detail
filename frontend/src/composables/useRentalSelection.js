import { ref, computed, reactive } from 'vue'

export const RENTAL_PERIODS = [
  { months: 3, price: 199, discount: 0 },
  { months: 6, price: 189, discount: 5 },
  { months: 12, price: 169, discount: 15 }
]

export const COLORS = [
  { value: 'white', name: '米白色', hex: '#f5f5dc' },
  { value: 'gray', name: '高级灰', hex: '#808080' },
  { value: 'brown', name: '咖啡棕', hex: '#8b4513' },
  { value: 'blue', name: '深海蓝', hex: '#4682b4' }
]

export const SIZES = [
  { value: 'small', name: '小款 180×80cm', priceChange: -100 },
  { value: 'medium', name: '中款 200×90cm', priceChange: 0 },
  { value: 'large', name: '大款 220×100cm', priceChange: 150 }
]

export const DELIVERY_METHODS = [
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

export function useRentalSelection(config = {}) {
  const basePrice = ref(config.basePrice ?? 199)
  const baseDeposit = ref(config.baseDeposit ?? 800)

  const selection = reactive({
    period: 6,
    color: 'white',
    size: 'medium',
    delivery: 'delivery'
  })

  const history = ref([])
  const maxHistorySize = 20
  const debugMode = config.debug ?? false

  const actionLog = ref([])
  const maxLogSize = 50

  const logAction = (action, details) => {
    const entry = {
      timestamp: Date.now(),
      action,
      details,
      selection: { ...selection }
    }
    actionLog.value.push(entry)
    if (actionLog.value.length > maxLogSize) {
      actionLog.value.shift()
    }
    if (debugMode) {
      console.log(`[RentalSelection] ${action}:`, details)
    }
  }

  const selectedPeriodData = computed(() => {
    return RENTAL_PERIODS.find(p => p.months === selection.period) || RENTAL_PERIODS[1]
  })

  const selectedColorData = computed(() => {
    return COLORS.find(c => c.value === selection.color) || COLORS[0]
  })

  const selectedSizeData = computed(() => {
    return SIZES.find(s => s.value === selection.size) || SIZES[1]
  })

  const selectedDeliveryData = computed(() => {
    return DELIVERY_METHODS.find(m => m.value === selection.delivery) || DELIVERY_METHODS[1]
  })

  const monthlyPrice = computed(() => {
    return selectedPeriodData.value.price
  })

  const sizePriceAdjustment = computed(() => {
    return selectedSizeData.value.priceChange
  })

  const deposit = computed(() => {
    const adjusted = baseDeposit.value + sizePriceAdjustment.value
    return Math.max(500, adjusted)
  })

  const rentalSubtotal = computed(() => {
    return monthlyPrice.value * selection.period
  })

  const deliveryFee = computed(() => {
    return selectedDeliveryData.value.fee
  })

  const totalAmount = computed(() => {
    return rentalSubtotal.value + deposit.value + deliveryFee.value
  })

  const selectionSummary = computed(() => {
    return {
      period: selection.period,
      periodLabel: `${selection.period}个月`,
      color: selection.color,
      colorName: selectedColorData.value.name,
      size: selection.size,
      sizeName: selectedSizeData.value.name,
      delivery: selection.delivery,
      deliveryName: selectedDeliveryData.value.name,
      monthlyPrice: monthlyPrice.value,
      deposit: deposit.value,
      deliveryFee: deliveryFee.value,
      rentalSubtotal: rentalSubtotal.value,
      totalAmount: totalAmount.value
    }
  })

  const stateFlow = computed(() => {
    return {
      period: {
        current: selection.period,
        options: RENTAL_PERIODS,
        label: '租期'
      },
      color: {
        current: selection.color,
        currentName: selectedColorData.value.name,
        options: COLORS,
        label: '颜色'
      },
      size: {
        current: selection.size,
        currentName: selectedSizeData.value.name,
        options: SIZES,
        label: '尺寸'
      },
      delivery: {
        current: selection.delivery,
        currentName: selectedDeliveryData.value.name,
        options: DELIVERY_METHODS,
        label: '配送方式'
      }
    }
  })

  const saveToHistory = () => {
    if (history.value.length >= maxHistorySize) {
      history.value.shift()
    }
    history.value.push(JSON.parse(JSON.stringify(selection)))
    logAction('SAVE_HISTORY', { snapshot: { ...selection } })
  }

  const setPeriod = (months) => {
    if (selection.period !== months) {
      const oldValue = selection.period
      saveToHistory()
      selection.period = months
      logAction('SET_PERIOD', { oldValue, newValue: months })
    }
  }

  const setColor = (color) => {
    if (selection.color !== color) {
      const oldValue = selection.color
      saveToHistory()
      selection.color = color
      logAction('SET_COLOR', { oldValue, newValue: color })
    }
  }

  const setSize = (size) => {
    if (selection.size !== size) {
      const oldValue = selection.size
      saveToHistory()
      selection.size = size
      logAction('SET_SIZE', { oldValue, newValue: size })
    }
  }

  const setDelivery = (delivery) => {
    if (selection.delivery !== delivery) {
      const oldValue = selection.delivery
      saveToHistory()
      selection.delivery = delivery
      logAction('SET_DELIVERY', { oldValue, newValue: delivery })
    }
  }

  const undo = () => {
    if (history.value.length > 0) {
      const previous = history.value.pop()
      const currentSnapshot = { ...selection }
      Object.assign(selection, previous)
      logAction('UNDO', { restored: previous, discarded: currentSnapshot })
      return true
    }
    return false
  }

  const reset = () => {
    const currentSnapshot = { ...selection }
    saveToHistory()
    selection.period = 6
    selection.color = 'white'
    selection.size = 'medium'
    selection.delivery = 'delivery'
    logAction('RESET', { from: currentSnapshot, to: { ...selection } })
  }

  const validate = () => {
    const errors = []

    if (!selection.period || !RENTAL_PERIODS.find(p => p.months === selection.period)) {
      errors.push('请选择有效的租期')
    }

    if (!selection.color || !COLORS.find(c => c.value === selection.color)) {
      errors.push('请选择有效的颜色')
    }

    if (!selection.size || !SIZES.find(s => s.value === selection.size)) {
      errors.push('请选择有效的尺寸')
    }

    if (!selection.delivery || !DELIVERY_METHODS.find(m => m.value === selection.delivery)) {
      errors.push('请选择有效的配送方式')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  const canUndo = computed(() => history.value.length > 0)

  const hasChanges = computed(() => history.value.length > 0)

  const getActionLog = () => {
    return [...actionLog.value]
  }

  const clearLog = () => {
    actionLog.value = []
    logAction('CLEAR_LOG', {})
  }

  const clearHistory = () => {
    history.value = []
    logAction('CLEAR_HISTORY', {})
  }

  const getPricingBreakdown = computed(() => {
    return {
      monthlyPrice: monthlyPrice.value,
      period: selection.period,
      rentalSubtotal: rentalSubtotal.value,
      baseDeposit: baseDeposit.value,
      sizeAdjustment: sizePriceAdjustment.value,
      finalDeposit: deposit.value,
      deliveryFee: deliveryFee.value,
      totalAmount: totalAmount.value
    }
  })

  return {
    basePrice,
    baseDeposit,
    selection,
    history,
    actionLog,
    selectedPeriodData,
    selectedColorData,
    selectedSizeData,
    selectedDeliveryData,
    monthlyPrice,
    sizePriceAdjustment,
    deposit,
    rentalSubtotal,
    deliveryFee,
    totalAmount,
    selectionSummary,
    stateFlow,
    setPeriod,
    setColor,
    setSize,
    setDelivery,
    undo,
    reset,
    validate,
    canUndo,
    hasChanges,
    getActionLog,
    clearLog,
    clearHistory,
    getPricingBreakdown
  }
}
