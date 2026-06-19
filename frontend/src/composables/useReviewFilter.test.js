import { describe, it, expect, beforeEach } from 'vitest'
import { useReviewFilter, REVIEW_SORT_OPTIONS } from './useReviewFilter'

const createMockReviews = () => [
  {
    id: 'review-1',
    rating: 5,
    content: '非常好用，质量很棒！',
    userName: '张三',
    createTime: '2024-01-15T10:00:00Z',
    images: ['img1.jpg'],
    helpfulCount: 10
  },
  {
    id: 'review-2',
    rating: 4,
    content: '还不错，价格合理',
    userName: '李四',
    createTime: '2024-01-14T10:00:00Z',
    images: [],
    helpfulCount: 5
  },
  {
    id: 'review-3',
    rating: 3,
    content: '一般般，没有想象中好',
    userName: '王五',
    createTime: '2024-01-13T10:00:00Z',
    images: ['img2.jpg', 'img3.jpg'],
    helpfulCount: 2
  },
  {
    id: 'review-4',
    rating: 5,
    content: '超级喜欢！强烈推荐',
    userName: '赵六',
    createTime: '2024-01-12T10:00:00Z',
    images: [],
    helpfulCount: 20
  },
  {
    id: 'review-5',
    rating: 2,
    content: '质量一般，不太满意',
    userName: '钱七',
    createTime: '2024-01-11T10:00:00Z',
    images: [],
    helpfulCount: 1
  }
]

describe('评价筛选功能测试', () => {
  let reviewFilter

  describe('初始化状态', () => {
    beforeEach(() => {
      reviewFilter = useReviewFilter(createMockReviews())
    })

    it('应该正确初始化评价列表', () => {
      expect(reviewFilter.reviews.value.length).toBe(5)
    })

    it('应该有默认的筛选条件', () => {
      expect(reviewFilter.filters.rating).toBe(null)
      expect(reviewFilter.filters.hasImages).toBe(false)
      expect(reviewFilter.filters.keyword).toBe('')
    })

    it('应该有默认的排序方式', () => {
      expect(reviewFilter.sortBy.value).toBe('newest')
    })

    it('应该有默认的分页配置', () => {
      expect(reviewFilter.currentPage.value).toBe(1)
      expect(reviewFilter.pageSize.value).toBe(10)
    })
  })

  describe('按评分筛选', () => {
    beforeEach(() => {
      reviewFilter = useReviewFilter(createMockReviews())
    })

    it('应该能够筛选5星评价', () => {
      reviewFilter.setRatingFilter(5)
      expect(reviewFilter.filteredReviews.value.length).toBe(2)
      expect(reviewFilter.filteredReviews.value.every(r => r.rating === 5)).toBe(true)
    })

    it('应该能够筛选4星评价', () => {
      reviewFilter.setRatingFilter(4)
      expect(reviewFilter.filteredReviews.value.length).toBe(1)
      expect(reviewFilter.filteredReviews.value[0].rating).toBe(4)
    })

    it('应该能够筛选3星评价', () => {
      reviewFilter.setRatingFilter(3)
      expect(reviewFilter.filteredReviews.value.length).toBe(1)
      expect(reviewFilter.filteredReviews.value[0].rating).toBe(3)
    })

    it('应该能够筛选2星评价', () => {
      reviewFilter.setRatingFilter(2)
      expect(reviewFilter.filteredReviews.value.length).toBe(1)
      expect(reviewFilter.filteredReviews.value[0].rating).toBe(2)
    })

    it('应该能够筛选1星评价', () => {
      reviewFilter.setRatingFilter(1)
      expect(reviewFilter.filteredReviews.value.length).toBe(0)
    })

    it('筛选后应该重置到第一页', () => {
      reviewFilter.setPage(2)
      reviewFilter.setRatingFilter(5)
      expect(reviewFilter.currentPage.value).toBe(1)
    })
  })

  describe('按是否有图片筛选', () => {
    beforeEach(() => {
      reviewFilter = useReviewFilter(createMockReviews())
    })

    it('应该能够筛选有图片的评价', () => {
      reviewFilter.setHasImagesFilter(true)
      expect(reviewFilter.filteredReviews.value.length).toBe(2)
      expect(reviewFilter.filteredReviews.value.every(r => r.images && r.images.length > 0)).toBe(true)
    })

    it('应该能够筛选没有图片的评价', () => {
      reviewFilter.setHasImagesFilter(false)
      expect(reviewFilter.filteredReviews.value.length).toBe(5)
    })

    it('筛选后应该重置到第一页', () => {
      reviewFilter.setPage(2)
      reviewFilter.setHasImagesFilter(true)
      expect(reviewFilter.currentPage.value).toBe(1)
    })
  })

  describe('按关键词搜索', () => {
    beforeEach(() => {
      reviewFilter = useReviewFilter(createMockReviews())
    })

    it('应该能够搜索评价内容', () => {
      reviewFilter.setKeyword('质量')
      expect(reviewFilter.filteredReviews.value.length).toBe(2)
    })

    it('应该能够搜索用户名', () => {
      reviewFilter.setKeyword('张三')
      expect(reviewFilter.filteredReviews.value.length).toBe(1)
    })

    it('应该支持模糊搜索', () => {
      reviewFilter.setKeyword('好')
      expect(reviewFilter.filteredReviews.value.length).toBe(2)
    })

    it('应该不区分大小写', () => {
      reviewFilter.setKeyword('VERY GOOD')
      reviewFilter.setKeyword('very good')
      expect(reviewFilter.filteredReviews.value.length).toBe(0)
    })

    it('搜索空字符串应该返回所有评价', () => {
      reviewFilter.setKeyword('好')
      expect(reviewFilter.filteredReviews.value.length).toBeGreaterThan(0)

      reviewFilter.setKeyword('')
      expect(reviewFilter.filteredReviews.value.length).toBe(5)
    })

    it('搜索后应该重置到第一页', () => {
      reviewFilter.setPage(2)
      reviewFilter.setKeyword('质量')
      expect(reviewFilter.currentPage.value).toBe(1)
    })
  })

  describe('组合筛选', () => {
    beforeEach(() => {
      reviewFilter = useReviewFilter(createMockReviews())
    })

    it('应该能够组合评分和图片筛选', () => {
      reviewFilter.setRatingFilter(5)
      reviewFilter.setHasImagesFilter(true)

      expect(reviewFilter.filteredReviews.value.length).toBe(1)
      expect(reviewFilter.filteredReviews.value[0].rating).toBe(5)
      expect(reviewFilter.filteredReviews.value[0].images.length).toBeGreaterThan(0)
    })

    it('应该能够组合评分和关键词筛选', () => {
      reviewFilter.setRatingFilter(5)
      reviewFilter.setKeyword('喜欢')

      expect(reviewFilter.filteredReviews.value.length).toBe(1)
      expect(reviewFilter.filteredReviews.value[0].content).toContain('喜欢')
    })

    it('应该能够组合所有筛选条件', () => {
      reviewFilter.setRatingFilter(5)
      reviewFilter.setHasImagesFilter(true)
      reviewFilter.setKeyword('好')

      expect(reviewFilter.filteredReviews.value.length).toBe(1)
    })
  })

  describe('排序功能', () => {
    beforeEach(() => {
      reviewFilter = useReviewFilter(createMockReviews())
    })

    it('应该按最新排序', () => {
      reviewFilter.setSortBy('newest')
      const reviews = reviewFilter.sortedReviews.value

      for (let i = 0; i < reviews.length - 1; i++) {
        expect(new Date(reviews[i].createTime) >= new Date(reviews[i + 1].createTime)).toBe(true)
      }
    })

    it('应该按有帮助程度排序', () => {
      reviewFilter.setSortBy('helpful')
      const reviews = reviewFilter.sortedReviews.value

      for (let i = 0; i < reviews.length - 1; i++) {
        expect(reviews[i].helpfulCount >= reviews[i + 1].helpfulCount).toBe(true)
      }
    })

    it('应该按评分从高到低排序', () => {
      reviewFilter.setSortBy('rating-high')
      const reviews = reviewFilter.sortedReviews.value

      for (let i = 0; i < reviews.length - 1; i++) {
        expect(reviews[i].rating >= reviews[i + 1].rating).toBe(true)
      }
    })

    it('应该按评分从低到高排序', () => {
      reviewFilter.setSortBy('rating-low')
      const reviews = reviewFilter.sortedReviews.value

      for (let i = 0; i < reviews.length - 1; i++) {
        expect(reviews[i].rating <= reviews[i + 1].rating).toBe(true)
      }
    })
  })

  describe('分页功能', () => {
    it('应该正确计算总页数', () => {
      reviewFilter = useReviewFilter(createMockReviews())
      expect(reviewFilter.totalPages.value).toBe(1)
    })

    it('应该能够设置自定义页面大小', () => {
      reviewFilter = useReviewFilter(createMockReviews())
      reviewFilter.setPageSize(2)
      expect(reviewFilter.totalPages.value).toBe(3)
    })

    it('应该能够下一页', () => {
      reviewFilter = useReviewFilter(createMockReviews())
      reviewFilter.setPageSize(2)

      expect(reviewFilter.currentPage.value).toBe(1)
      reviewFilter.nextPage()
      expect(reviewFilter.currentPage.value).toBe(2)
    })

    it('不应该超过最大页数', () => {
      reviewFilter = useReviewFilter(createMockReviews())
      reviewFilter.setPageSize(2)

      reviewFilter.setPage(3)
      reviewFilter.nextPage()
      expect(reviewFilter.currentPage.value).toBe(3)
    })

    it('应该能够上一页', () => {
      reviewFilter = useReviewFilter(createMockReviews())
      reviewFilter.setPageSize(2)

      reviewFilter.setPage(2)
      reviewFilter.prevPage()
      expect(reviewFilter.currentPage.value).toBe(1)
    })

    it('不应该小于第一页', () => {
      reviewFilter = useReviewFilter(createMockReviews())

      reviewFilter.prevPage()
      expect(reviewFilter.currentPage.value).toBe(1)
    })

    it('应该返回分页后的评价', () => {
      reviewFilter = useReviewFilter(createMockReviews())
      reviewFilter.setPageSize(2)

      const firstPageReviews = reviewFilter.paginatedReviews.value
      expect(firstPageReviews.length).toBe(2)

      reviewFilter.nextPage()
      const secondPageReviews = reviewFilter.paginatedReviews.value
      expect(secondPageReviews.length).toBe(2)

      reviewFilter.nextPage()
      const thirdPageReviews = reviewFilter.paginatedReviews.value
      expect(thirdPageReviews.length).toBe(1)
    })

    it('应该能够跳转到指定页', () => {
      reviewFilter = useReviewFilter(createMockReviews())
      reviewFilter.setPageSize(2)

      reviewFilter.setPage(2)
      expect(reviewFilter.currentPage.value).toBe(2)

      reviewFilter.setPage(1)
      expect(reviewFilter.currentPage.value).toBe(1)
    })

    it('不应该跳转到无效页', () => {
      reviewFilter = useReviewFilter(createMockReviews())
      reviewFilter.setPageSize(2)

      reviewFilter.setPage(0)
      expect(reviewFilter.currentPage.value).toBe(1)

      reviewFilter.setPage(100)
      expect(reviewFilter.currentPage.value).toBe(1)
    })
  })

  describe('评分统计', () => {
    beforeEach(() => {
      reviewFilter = useReviewFilter(createMockReviews())
    })

    it('应该正确计算评分分布', () => {
      const distribution = reviewFilter.ratingDistribution.value

      expect(distribution[5]).toBe(2)
      expect(distribution[4]).toBe(1)
      expect(distribution[3]).toBe(1)
      expect(distribution[2]).toBe(1)
      expect(distribution[1]).toBe(0)
    })

    it('应该正确计算平均评分', () => {
      const average = reviewFilter.averageRating.value
      expect(parseFloat(average)).toBe(3.8)
    })

    it('应该正确计算总评价数', () => {
      expect(reviewFilter.totalReviews.value).toBe(5)
    })

    it('应该正确计算筛选后的评价数', () => {
      reviewFilter.setRatingFilter(5)
      expect(reviewFilter.filteredCount.value).toBe(2)
    })
  })

  describe('重置功能', () => {
    beforeEach(() => {
      reviewFilter = useReviewFilter(createMockReviews())
    })

    it('应该能够重置所有筛选条件', () => {
      reviewFilter.setRatingFilter(5)
      reviewFilter.setHasImagesFilter(true)
      reviewFilter.setKeyword('质量')
      reviewFilter.setPage(2)

      reviewFilter.resetFilters()

      expect(reviewFilter.filters.rating).toBe(null)
      expect(reviewFilter.filters.hasImages).toBe(false)
      expect(reviewFilter.filters.keyword).toBe('')
      expect(reviewFilter.currentPage.value).toBe(1)
    })
  })

  describe('评价管理', () => {
    beforeEach(() => {
      reviewFilter = useReviewFilter(createMockReviews())
    })

    it('应该能够添加评价', () => {
      const initialCount = reviewFilter.reviews.value.length

      reviewFilter.addReview({
        rating: 4,
        content: '新评价',
        userName: '测试用户'
      })

      expect(reviewFilter.reviews.value.length).toBe(initialCount + 1)
    })

    it('添加评价应该包含默认字段', () => {
      reviewFilter.addReview({
        rating: 4,
        content: '新评价',
        userName: '测试用户'
      })

      const newReview = reviewFilter.reviews.value[reviewFilter.reviews.value.length - 1]
      expect(newReview).toHaveProperty('id')
      expect(newReview).toHaveProperty('createTime')
      expect(newReview).toHaveProperty('helpfulCount')
      expect(newReview.helpfulCount).toBe(0)
    })

    it('应该能够删除评价', () => {
      const initialCount = reviewFilter.reviews.value.length

      reviewFilter.removeReview('review-1')

      expect(reviewFilter.reviews.value.length).toBe(initialCount - 1)
      expect(reviewFilter.reviews.value.find(r => r.id === 'review-1')).toBeUndefined()
    })

    it('删除不存在的评价应该不报错', () => {
      const initialCount = reviewFilter.reviews.value.length

      reviewFilter.removeReview('non-existent')

      expect(reviewFilter.reviews.value.length).toBe(initialCount)
    })

    it('应该能够标记评价为有帮助', () => {
      const review = reviewFilter.reviews.value[0]
      const initialHelpfulCount = review.helpfulCount || 0

      reviewFilter.markHelpful('review-1')

      expect(review.helpfulCount).toBe(initialHelpfulCount + 1)
    })
  })

  describe('筛选摘要', () => {
    beforeEach(() => {
      reviewFilter = useReviewFilter(createMockReviews())
    })

    it('无筛选条件时应该显示"全部评价"', () => {
      expect(reviewFilter.getFilterSummary.value).toBe('全部评价')
    })

    it('有评分筛选时应该包含评分信息', () => {
      reviewFilter.setRatingFilter(5)
      expect(reviewFilter.getFilterSummary.value).toContain('5星评价')
    })

    it('有图片筛选时应该包含图片信息', () => {
      reviewFilter.setHasImagesFilter(true)
      expect(reviewFilter.getFilterSummary.value).toContain('有图评价')
    })

    it('有关键词筛选时应该包含关键词', () => {
      reviewFilter.setKeyword('质量')
      expect(reviewFilter.getFilterSummary.value).toContain('"质量"')
    })

    it('多个筛选条件应该正确组合', () => {
      reviewFilter.setRatingFilter(5)
      reviewFilter.setHasImagesFilter(true)
      reviewFilter.setKeyword('好')

      const summary = reviewFilter.getFilterSummary.value
      expect(summary).toContain('5星评价')
      expect(summary).toContain('有图评价')
      expect(summary).toContain('"好"')
    })
  })

  describe('空数据处理', () => {
    it('空评价列表应该正常工作', () => {
      reviewFilter = useReviewFilter([])

      expect(reviewFilter.totalReviews.value).toBe(0)
      expect(reviewFilter.averageRating.value).toBe(0)
      expect(reviewFilter.filteredReviews.value.length).toBe(0)
    })

    it('筛选后无结果应该正常工作', () => {
      reviewFilter = useReviewFilter(createMockReviews())
      reviewFilter.setRatingFilter(1)

      expect(reviewFilter.filteredReviews.value.length).toBe(0)
      expect(reviewFilter.totalPages.value).toBe(0)
    })
  })
})
