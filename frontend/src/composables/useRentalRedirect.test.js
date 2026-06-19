import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useRentalSelection } from './useRentalSelection'

describe('立即租赁跳转功能测试', () => {
  let rentalSelection
  let mockRouter
  let mockNotification

  const createMockRouter = () => ({
    push: vi.fn(),
    replace: vi.fn(),
    currentRoute: {
      value: { path: '/' }
    }
  })

  const createMockNotification = () => ({
    show: false,
    message: '',
    type: 'success',
    showNotification: (msg, type) => {
      mockNotification.message = msg
      mockNotification.type = type
      mockNotification.show = true
    }
  })

  beforeEach(() => {
    rentalSelection = useRentalSelection({
      basePrice: 199,
      baseDeposit: 800
    })
    mockRouter = createMockRouter()
    mockNotification = createMockNotification()
  })

  describe('租赁验证', () => {
    it('默认配置应该通过验证', () => {
      const validation = rentalSelection.validate()
      expect(validation.valid).toBe(true)
      expect(validation.errors.length).toBe(0)
    })

    it('无效配置应该不通过验证', () => {
      rentalSelection.selection.period = 99
      const validation = rentalSelection.validate()
      expect(validation.valid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
    })
  })

  describe('租赁摘要生成', () => {
    beforeEach(() => {
      rentalSelection = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })
    })

    it('应该生成完整的租赁摘要', () => {
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

    it('应该包含正确的总金额', () => {
      const summary = rentalSelection.selectionSummary.value

      const expectedRentalSubtotal = 189 * 6
      const expectedTotal = expectedRentalSubtotal + summary.deposit + summary.deliveryFee

      expect(summary.rentalSubtotal).toBe(expectedRentalSubtotal)
      expect(summary.totalAmount).toBe(expectedTotal)
    })

    it('应该包含正确的中文标签', () => {
      const summary = rentalSelection.selectionSummary.value

      expect(summary.periodLabel).toBe('6个月')
      expect(summary.colorName).toBe('米白色')
      expect(summary.sizeName).toBe('中款 200×90cm')
      expect(summary.deliveryName).toBe('送货上门')
    })

    it('应该正确计算不同配置的总金额', () => {
      rentalSelection.setPeriod(12)
      rentalSelection.setSize('large')
      rentalSelection.setDelivery('install')

      const summary = rentalSelection.selectionSummary.value

      expect(summary.monthlyPrice).toBe(169)
      expect(summary.rentalSubtotal).toBe(169 * 12)
      expect(summary.deposit).toBe(800 + 150)
      expect(summary.deliveryFee).toBe(150)
      expect(summary.totalAmount).toBe(169 * 12 + 950 + 150)
    })
  })

  describe('租赁流程测试', () => {
    beforeEach(() => {
      rentalSelection = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })
    })

    it('应该能够完成完整的租赁选择流程', () => {
      rentalSelection.setPeriod(12)
      expect(rentalSelection.selection.period).toBe(12)

      rentalSelection.setColor('blue')
      expect(rentalSelection.selection.color).toBe('blue')

      rentalSelection.setSize('large')
      expect(rentalSelection.selection.size).toBe('large')

      rentalSelection.setDelivery('install')
      expect(rentalSelection.selection.delivery).toBe('install')

      const validation = rentalSelection.validate()
      expect(validation.valid).toBe(true)
    })

    it('应该能够计算完整租赁流程的总费用', () => {
      rentalSelection.setPeriod(12)
      rentalSelection.setSize('large')
      rentalSelection.setDelivery('install')

      const summary = rentalSelection.selectionSummary.value

      expect(summary.totalAmount).toBeGreaterThan(0)
      expect(summary.deposit).toBe(950)
      expect(summary.deliveryFee).toBe(150)
    })

    it('撤销功能应该正常工作', () => {
      const initialPeriod = rentalSelection.selection.period

      rentalSelection.setPeriod(12)
      expect(rentalSelection.selection.period).toBe(12)

      rentalSelection.undo()
      expect(rentalSelection.selection.period).toBe(initialPeriod)
    })

    it('重置功能应该恢复默认配置', () => {
      rentalSelection.setPeriod(12)
      rentalSelection.setColor('blue')
      rentalSelection.setSize('large')

      rentalSelection.reset()

      expect(rentalSelection.selection.period).toBe(6)
      expect(rentalSelection.selection.color).toBe('white')
      expect(rentalSelection.selection.size).toBe('medium')
    })
  })

  describe('错误处理', () => {
    it('无效租期应该返回错误', () => {
      rentalSelection.selection.period = 0
      const validation = rentalSelection.validate()
      expect(validation.valid).toBe(false)
    })

    it('无效颜色应该返回错误', () => {
      rentalSelection.selection.color = 'invalid'
      const validation = rentalSelection.validate()
      expect(validation.valid).toBe(false)
    })

    it('无效尺寸应该返回错误', () => {
      rentalSelection.selection.size = 'invalid'
      const validation = rentalSelection.validate()
      expect(validation.valid).toBe(false)
    })

    it('无效配送方式应该返回错误', () => {
      rentalSelection.selection.delivery = 'invalid'
      const validation = rentalSelection.validate()
      expect(validation.valid).toBe(false)
    })

    it('多个错误应该全部返回', () => {
      rentalSelection.selection.period = 99
      rentalSelection.selection.color = 'invalid'

      const validation = rentalSelection.validate()
      expect(validation.errors.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('租赁跳转准备', () => {
    beforeEach(() => {
      rentalSelection = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })
    })

    it('应该准备正确的跳转数据', () => {
      rentalSelection.setPeriod(12)
      rentalSelection.setColor('blue')
      rentalSelection.setSize('large')
      rentalSelection.setDelivery('install')

      const summary = rentalSelection.selectionSummary.value

      const jumpData = {
        productId: 'product-001',
        rentalConfig: {
          period: summary.period,
          color: summary.color,
          size: summary.size,
          delivery: summary.delivery
        },
        pricing: {
          monthlyPrice: summary.monthlyPrice,
          deposit: summary.deposit,
          deliveryFee: summary.deliveryFee,
          subtotal: summary.rentalSubtotal,
          total: summary.totalAmount
        },
        labels: {
          periodLabel: summary.periodLabel,
          colorName: summary.colorName,
          sizeName: summary.sizeName,
          deliveryName: summary.deliveryName
        }
      }

      expect(jumpData.productId).toBe('product-001')
      expect(jumpData.rentalConfig.period).toBe(12)
      expect(jumpData.rentalConfig.color).toBe('blue')
      expect(jumpData.pricing.total).toBeGreaterThan(0)
    })

    it('应该生成完整的订单摘要', () => {
      rentalSelection.setPeriod(6)
      const summary = rentalSelection.selectionSummary.value

      const orderSummary = `订单摘要：
      租期：${summary.periodLabel}
      颜色：${summary.colorName}
      尺寸：${summary.sizeName}
      配送：${summary.deliveryName}
      月租：¥${summary.monthlyPrice}
      押金：¥${summary.deposit}
      配送费：¥${summary.deliveryFee}
      应付总额：¥${summary.totalAmount}`

      expect(orderSummary).toContain('6个月')
      expect(orderSummary).toContain('米白色')
      expect(orderSummary).toContain('¥')
    })
  })

  describe('状态追踪', () => {
    beforeEach(() => {
      rentalSelection = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800,
        debug: true
      })
    })

    it('应该记录所有操作', () => {
      rentalSelection.setPeriod(12)
      rentalSelection.setColor('blue')
      rentalSelection.setSize('large')

      const log = rentalSelection.getActionLog()

      expect(log.length).toBeGreaterThan(0)
      expect(log.some(entry => entry.action === 'SET_PERIOD')).toBe(true)
      expect(log.some(entry => entry.action === 'SET_COLOR')).toBe(true)
      expect(log.some(entry => entry.action === 'SET_SIZE')).toBe(true)
    })

    it('应该能够清空日志', () => {
      rentalSelection.setPeriod(12)
      const logCountBefore = rentalSelection.getActionLog().length
      expect(logCountBefore).toBeGreaterThan(0)

      rentalSelection.clearLog()
      const logCountAfter = rentalSelection.getActionLog().length
      expect(logCountAfter).toBeLessThan(logCountBefore)
    })

    it('应该追踪是否有未保存的更改', () => {
      expect(rentalSelection.hasChanges.value).toBe(false)

      rentalSelection.setPeriod(12)
      expect(rentalSelection.hasChanges.value).toBe(true)

      rentalSelection.clearHistory()
      expect(rentalSelection.hasChanges.value).toBe(false)
    })
  })

  describe('配置选项验证', () => {
    it('不同的租期应该有不同的价格', () => {
      rentalSelection.setPeriod(3)
      const price3 = rentalSelection.monthlyPrice.value

      rentalSelection.setPeriod(6)
      const price6 = rentalSelection.monthlyPrice.value

      rentalSelection.setPeriod(12)
      const price12 = rentalSelection.monthlyPrice.value

      expect(price3).toBe(199)
      expect(price6).toBe(189)
      expect(price12).toBe(169)
      expect(price3 > price6).toBe(true)
      expect(price6 > price12).toBe(true)
    })

    it('不同的尺寸应该影响押金', () => {
      rentalSelection.setSize('small')
      const depositSmall = rentalSelection.deposit.value

      rentalSelection.setSize('medium')
      const depositMedium = rentalSelection.deposit.value

      rentalSelection.setSize('large')
      const depositLarge = rentalSelection.deposit.value

      expect(depositSmall).toBeLessThan(depositMedium)
      expect(depositMedium).toBeLessThan(depositLarge)
    })

    it('不同的配送方式应该影响总金额', () => {
      rentalSelection.setDelivery('pickup')
      const totalPickup = rentalSelection.totalAmount.value

      rentalSelection.setDelivery('delivery')
      const totalDelivery = rentalSelection.totalAmount.value

      rentalSelection.setDelivery('install')
      const totalInstall = rentalSelection.totalAmount.value

      expect(totalPickup).toBe(totalDelivery)
      expect(totalInstall).toBe(totalPickup + 150)
    })
  })
})
