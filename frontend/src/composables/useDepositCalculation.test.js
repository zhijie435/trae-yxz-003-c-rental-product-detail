import { describe, it, expect, beforeEach } from 'vitest'
import { useRentalSelection } from './useRentalSelection'

describe('押金计算功能测试', () => {
  let rentalSelection

  describe('基础押金计算', () => {
    beforeEach(() => {
      rentalSelection = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })
    })

    it('应该使用配置的基础押金', () => {
      expect(rentalSelection.baseDeposit.value).toBe(800)
      expect(rentalSelection.deposit.value).toBe(800)
    })

    it('应该使用默认的基础押金', () => {
      const rental = useRentalSelection()
      expect(rental.baseDeposit.value).toBe(800)
      expect(rental.deposit.value).toBe(800)
    })
  })

  describe('尺寸调整押金', () => {
    it('小尺寸应该减少押金', () => {
      const rental = useRentalSelection({
        baseDeposit: 800
      })

      rental.setSize('small')
      expect(rental.deposit.value).toBe(700)
    })

    it('中尺寸应该保持基础押金', () => {
      const rental = useRentalSelection({
        baseDeposit: 800
      })

      rental.setSize('medium')
      expect(rental.deposit.value).toBe(800)
    })

    it('大尺寸应该增加押金', () => {
      const rental = useRentalSelection({
        baseDeposit: 800
      })

      rental.setSize('large')
      expect(rental.deposit.value).toBe(950)
    })
  })

  describe('最小押金限制', () => {
    it('不应该低于最小押金500元（小尺寸+低基础押金）', () => {
      const rental = useRentalSelection({
        baseDeposit: 300
      })

      rental.setSize('small')
      expect(rental.deposit.value).toBe(500)
    })

    it('应该保持合理的押金计算（小尺寸+500基础押金）', () => {
      const rental = useRentalSelection({
        baseDeposit: 500
      })

      rental.setSize('small')
      expect(rental.deposit.value).toBe(500)
    })

    it('应该正确计算边界值（小尺寸+501基础押金），但受最小押金限制', () => {
      const rental = useRentalSelection({
        baseDeposit: 501
      })

      rental.setSize('small')
      const calculatedDeposit = 501 + (-100)
      expect(calculatedDeposit).toBe(401)
      expect(rental.deposit.value).toBe(Math.max(500, calculatedDeposit))
    })
  })

  describe('租金小计计算', () => {
    beforeEach(() => {
      rentalSelection = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })
    })

    it('应该正确计算3个月的租金', () => {
      rentalSelection.setPeriod(3)
      expect(rentalSelection.monthlyPrice.value).toBe(199)
      expect(rentalSelection.rentalSubtotal.value).toBe(597)
    })

    it('应该正确计算6个月的租金', () => {
      rentalSelection.setPeriod(6)
      expect(rentalSelection.monthlyPrice.value).toBe(189)
      expect(rentalSelection.rentalSubtotal.value).toBe(1134)
    })

    it('应该正确计算12个月的租金', () => {
      rentalSelection.setPeriod(12)
      expect(rentalSelection.monthlyPrice.value).toBe(169)
      expect(rentalSelection.rentalSubtotal.value).toBe(2028)
    })
  })

  describe('配送费计算', () => {
    beforeEach(() => {
      rentalSelection = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })
    })

    it('门店自提应该免费', () => {
      rentalSelection.setDelivery('pickup')
      expect(rentalSelection.deliveryFee.value).toBe(0)
    })

    it('送货上门应该免费', () => {
      rentalSelection.setDelivery('delivery')
      expect(rentalSelection.deliveryFee.value).toBe(0)
    })

    it('安装配送应该收费150元', () => {
      rentalSelection.setDelivery('install')
      expect(rentalSelection.deliveryFee.value).toBe(150)
    })
  })

  describe('总金额计算', () => {
    it('应该正确计算默认配置的总金额', () => {
      const rental = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })

      const expected = rental.rentalSubtotal.value + rental.deposit.value + rental.deliveryFee.value
      expect(rental.totalAmount.value).toBe(expected)
    })

    it('应该正确计算12个月+大尺寸+安装配送的总金额', () => {
      const rental = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })

      rental.setPeriod(12)
      rental.setSize('large')
      rental.setDelivery('install')

      const expectedRentalSubtotal = 169 * 12
      const expectedDeposit = 800 + 150
      const expectedDeliveryFee = 150
      const expectedTotal = expectedRentalSubtotal + expectedDeposit + expectedDeliveryFee

      expect(rental.rentalSubtotal.value).toBe(expectedRentalSubtotal)
      expect(rental.deposit.value).toBe(expectedDeposit)
      expect(rental.deliveryFee.value).toBe(expectedDeliveryFee)
      expect(rental.totalAmount.value).toBe(expectedTotal)
    })

    it('应该正确计算小尺寸的所有费用', () => {
      const rental = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })

      rental.setPeriod(6)
      rental.setSize('small')
      rental.setDelivery('pickup')

      expect(rental.monthlyPrice.value).toBe(189)
      expect(rental.rentalSubtotal.value).toBe(1134)
      expect(rental.deposit.value).toBe(700)
      expect(rental.deliveryFee.value).toBe(0)
      expect(rental.totalAmount.value).toBe(1834)
    })
  })

  describe('费用明细', () => {
    it('应该返回完整的费用明细', () => {
      const rental = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })

      rental.setPeriod(6)
      rental.setSize('large')
      rental.setDelivery('install')

      const breakdown = rental.getPricingBreakdown.value

      expect(breakdown).toHaveProperty('monthlyPrice')
      expect(breakdown).toHaveProperty('period')
      expect(breakdown).toHaveProperty('rentalSubtotal')
      expect(breakdown).toHaveProperty('baseDeposit')
      expect(breakdown).toHaveProperty('sizeAdjustment')
      expect(breakdown).toHaveProperty('finalDeposit')
      expect(breakdown).toHaveProperty('deliveryFee')
      expect(breakdown).toHaveProperty('totalAmount')
    })

    it('应该包含正确的尺寸调整值', () => {
      const rental = useRentalSelection({
        basePrice: 199,
        baseDeposit: 800
      })

      rental.setSize('large')
      const breakdown = rental.getPricingBreakdown.value

      expect(breakdown.sizeAdjustment).toBe(150)
      expect(breakdown.baseDeposit).toBe(800)
      expect(breakdown.finalDeposit).toBe(950)
    })
  })

  describe('押金说明计算', () => {
    it('不同尺寸应该有不同的押金说明', () => {
      const rental = useRentalSelection({
        baseDeposit: 800
      })

      rental.setSize('small')
      const summary1 = rental.selectionSummary.value

      rental.setSize('large')
      const summary2 = rental.selectionSummary.value

      expect(summary1.deposit).toBe(700)
      expect(summary2.deposit).toBe(950)
      expect(summary1.deposit).not.toBe(summary2.deposit)
    })
  })

  describe('价格联动计算', () => {
    it('改变租期应该更新月租价格', () => {
      const rental = useRentalSelection()

      rental.setPeriod(3)
      expect(rental.monthlyPrice.value).toBe(199)

      rental.setPeriod(6)
      expect(rental.monthlyPrice.value).toBe(189)

      rental.setPeriod(12)
      expect(rental.monthlyPrice.value).toBe(169)
    })

    it('改变尺寸应该更新押金和总金额', () => {
      const rental = useRentalSelection({
        baseDeposit: 800
      })

      rental.setPeriod(3)
      rental.setDelivery('pickup')

      const initialDeposit = rental.deposit.value
      const initialTotal = rental.totalAmount.value

      rental.setSize('large')

      expect(rental.deposit.value).toBe(initialDeposit + 150)
      expect(rental.totalAmount.value).toBe(initialTotal + 150)
    })

    it('改变配送方式应该更新配送费和总金额', () => {
      const rental = useRentalSelection({
        baseDeposit: 800
      })

      rental.setPeriod(3)
      rental.setDelivery('pickup')

      const initialDeliveryFee = rental.deliveryFee.value
      const initialTotal = rental.totalAmount.value

      rental.setDelivery('install')

      expect(rental.deliveryFee.value).toBe(initialDeliveryFee + 150)
      expect(rental.totalAmount.value).toBe(initialTotal + 150)
    })
  })
})
