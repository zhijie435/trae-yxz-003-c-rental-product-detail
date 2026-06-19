import { describe, it, expect, beforeEach } from 'vitest'
import { useRentalSelection, RENTAL_PERIODS, COLORS, SIZES, DELIVERY_METHODS } from './useRentalSelection'

describe('租期规格选择功能测试', () => {
  let rentalSelection

  beforeEach(() => {
    rentalSelection = useRentalSelection({
      basePrice: 199,
      baseDeposit: 800
    })
  })

  describe('初始状态', () => {
    it('应该使用默认配置初始化', () => {
      expect(rentalSelection.selection.period).toBe(6)
      expect(rentalSelection.selection.color).toBe('white')
      expect(rentalSelection.selection.size).toBe('medium')
      expect(rentalSelection.selection.delivery).toBe('delivery')
    })

    it('应该正确初始化价格', () => {
      expect(rentalSelection.basePrice.value).toBe(199)
      expect(rentalSelection.baseDeposit.value).toBe(800)
    })
  })

  describe('租期选择', () => {
    it('应该能够设置不同的租期', () => {
      rentalSelection.setPeriod(3)
      expect(rentalSelection.selection.period).toBe(3)
      expect(rentalSelection.monthlyPrice.value).toBe(199)

      rentalSelection.setPeriod(6)
      expect(rentalSelection.selection.period).toBe(6)
      expect(rentalSelection.monthlyPrice.value).toBe(189)

      rentalSelection.setPeriod(12)
      expect(rentalSelection.selection.period).toBe(12)
      expect(rentalSelection.monthlyPrice.value).toBe(169)
    })

    it('不应该在相同样值时重复保存历史', () => {
      rentalSelection.setPeriod(6)
      const initialHistoryLength = rentalSelection.history.value.length

      rentalSelection.setPeriod(6)
      expect(rentalSelection.history.value.length).toBe(initialHistoryLength)
    })

    it('应该保存历史记录', () => {
      rentalSelection.setPeriod(3)
      expect(rentalSelection.history.value.length).toBe(1)
      expect(rentalSelection.canUndo.value).toBe(true)
    })
  })

  describe('颜色选择', () => {
    it('应该能够选择不同的颜色', () => {
      const colors = ['white', 'gray', 'brown', 'blue']

      colors.forEach(color => {
        rentalSelection.setColor(color)
        expect(rentalSelection.selection.color).toBe(color)
      })
    })

    it('应该返回正确的颜色数据', () => {
      rentalSelection.setColor('gray')
      const colorData = rentalSelection.selectedColorData.value
      expect(colorData.value).toBe('gray')
      expect(colorData.name).toBe('高级灰')
      expect(colorData.hex).toBe('#808080')
    })
  })

  describe('尺寸选择', () => {
    it('应该能够选择不同的尺寸', () => {
      rentalSelection.setSize('small')
      expect(rentalSelection.selection.size).toBe('small')
      expect(rentalSelection.sizePriceAdjustment.value).toBe(-100)

      rentalSelection.setSize('medium')
      expect(rentalSelection.selection.size).toBe('medium')
      expect(rentalSelection.sizePriceAdjustment.value).toBe(0)

      rentalSelection.setSize('large')
      expect(rentalSelection.selection.size).toBe('large')
      expect(rentalSelection.sizePriceAdjustment.value).toBe(150)
    })

    it('应该返回正确的尺寸数据', () => {
      rentalSelection.setSize('large')
      const sizeData = rentalSelection.selectedSizeData.value
      expect(sizeData.value).toBe('large')
      expect(sizeData.name).toBe('大款 220×100cm')
    })
  })

  describe('配送方式选择', () => {
    it('应该能够选择不同的配送方式', () => {
      rentalSelection.setDelivery('pickup')
      expect(rentalSelection.selection.delivery).toBe('pickup')
      expect(rentalSelection.deliveryFee.value).toBe(0)

      rentalSelection.setDelivery('delivery')
      expect(rentalSelection.selection.delivery).toBe('delivery')
      expect(rentalSelection.deliveryFee.value).toBe(0)

      rentalSelection.setDelivery('install')
      expect(rentalSelection.selection.delivery).toBe('install')
      expect(rentalSelection.deliveryFee.value).toBe(150)
    })

    it('应该返回正确的配送方式数据', () => {
      rentalSelection.setDelivery('install')
      const deliveryData = rentalSelection.selectedDeliveryData.value
      expect(deliveryData.value).toBe('install')
      expect(deliveryData.name).toBe('安装配送')
      expect(deliveryData.fee).toBe(150)
    })
  })

  describe('撤销功能', () => {
    it('应该能够撤销上一步操作', () => {
      rentalSelection.setPeriod(3)
      expect(rentalSelection.selection.period).toBe(3)

      const result = rentalSelection.undo()
      expect(result).toBe(true)
      expect(rentalSelection.selection.period).toBe(6)
    })

    it('在历史为空时应该返回false', () => {
      const result = rentalSelection.undo()
      expect(result).toBe(false)
    })

    it('应该能够连续撤销多次', () => {
      rentalSelection.setPeriod(3)
      rentalSelection.setColor('gray')
      rentalSelection.setSize('large')

      rentalSelection.undo()
      expect(rentalSelection.selection.size).toBe('medium')

      rentalSelection.undo()
      expect(rentalSelection.selection.color).toBe('white')

      rentalSelection.undo()
      expect(rentalSelection.selection.period).toBe(6)
    })
  })

  describe('重置功能', () => {
    it('应该能够重置所有选择', () => {
      rentalSelection.setPeriod(12)
      rentalSelection.setColor('blue')
      rentalSelection.setSize('large')
      rentalSelection.setDelivery('install')

      rentalSelection.reset()

      expect(rentalSelection.selection.period).toBe(6)
      expect(rentalSelection.selection.color).toBe('white')
      expect(rentalSelection.selection.size).toBe('medium')
      expect(rentalSelection.selection.delivery).toBe('delivery')
    })

    it('重置时应该保存历史记录', () => {
      rentalSelection.setPeriod(3)
      rentalSelection.reset()

      expect(rentalSelection.history.value.length).toBeGreaterThan(0)
    })
  })

  describe('验证功能', () => {
    it('应该验证默认选择为有效', () => {
      const result = rentalSelection.validate()
      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('应该检测无效的租期', () => {
      rentalSelection.selection.period = 99
      const result = rentalSelection.validate()
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('请选择有效的租期')
    })

    it('应该检测无效的颜色', () => {
      rentalSelection.selection.color = 'invalid'
      const result = rentalSelection.validate()
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('请选择有效的颜色')
    })

    it('应该检测无效的尺寸', () => {
      rentalSelection.selection.size = 'invalid'
      const result = rentalSelection.validate()
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('请选择有效的尺寸')
    })

    it('应该检测无效的配送方式', () => {
      rentalSelection.selection.delivery = 'invalid'
      const result = rentalSelection.validate()
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('请选择有效的配送方式')
    })
  })

  describe('选择摘要', () => {
    it('应该返回完整的摘要信息', () => {
      const summary = rentalSelection.selectionSummary.value

      expect(summary).toHaveProperty('period')
      expect(summary).toHaveProperty('periodLabel')
      expect(summary).toHaveProperty('color')
      expect(summary).toHaveProperty('colorName')
      expect(summary).toHaveProperty('size')
      expect(summary).toHaveProperty('sizeName')
      expect(summary).toHaveProperty('delivery')
      expect(summary).toHaveProperty('deliveryName')
      expect(summary).toHaveProperty('monthlyPrice')
      expect(summary).toHaveProperty('deposit')
      expect(summary).toHaveProperty('deliveryFee')
      expect(summary).toHaveProperty('rentalSubtotal')
      expect(summary).toHaveProperty('totalAmount')
    })

    it('应该包含正确的租期标签', () => {
      const summary = rentalSelection.selectionSummary.value
      expect(summary.periodLabel).toBe('6个月')
    })
  })

  describe('状态流', () => {
    it('应该返回完整的状态流信息', () => {
      const flow = rentalSelection.stateFlow.value

      expect(flow).toHaveProperty('period')
      expect(flow).toHaveProperty('color')
      expect(flow).toHaveProperty('size')
      expect(flow).toHaveProperty('delivery')

      expect(flow.period).toHaveProperty('current')
      expect(flow.period).toHaveProperty('options')
      expect(flow.period).toHaveProperty('label')
    })
  })
})
