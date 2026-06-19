import { ref, computed, reactive } from 'vue'

export const REVIEW_SORT_OPTIONS = [
  { value: 'newest', label: '最新', icon: '🕐' },
  { value: 'helpful', label: '最有帮助', icon: '👍' },
  { value: 'rating-high', label: '评分最高', icon: '⭐' },
  { value: 'rating-low', label: '评分最低', icon: '📉' }
]

export const RATING_FILTERS = [
  { value: 5, label: '5星', count: 0 },
  { value: 4, label: '4星', count: 0 },
  { value: 3, label: '3星', count: 0 },
  { value: 2, label: '2星', count: 0 },
  { value: 1, label: '1星', count: 0 }
]

export function useReviewFilter(initialReviews = []) {
  const reviews = ref([...initialReviews])
  const filters = reactive({
    rating: null,
    hasImages: false,
    keyword: ''
  })

  const sortBy = ref('newest')
  const currentPage = ref(1)
  const pageSize = ref(10)

  const filteredReviews = computed(() => {
    let result = [...reviews.value]

    if (filters.rating !== null) {
      result = result.filter(r => r.rating === filters.rating)
    }

    if (filters.hasImages) {
      result = result.filter(r => r.images && r.images.length > 0)
    }

    if (filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase()
      result = result.filter(r =>
        r.content.toLowerCase().includes(keyword) ||
        (r.userName && r.userName.toLowerCase().includes(keyword))
      )
    }

    return result
  })

  const sortedReviews = computed(() => {
    const result = [...filteredReviews.value]

    switch (sortBy.value) {
      case 'newest':
        result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
        break
      case 'helpful':
        result.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0))
        break
      case 'rating-high':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'rating-low':
        result.sort((a, b) => a.rating - b.rating)
        break
    }

    return result
  })

  const totalPages = computed(() => {
    return Math.ceil(sortedReviews.value.length / pageSize.value)
  })

  const paginatedReviews = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return sortedReviews.value.slice(start, end)
  })

  const ratingDistribution = computed(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.value.forEach(r => {
      if (distribution.hasOwnProperty(r.rating)) {
        distribution[r.rating]++
      }
    })
    return distribution
  })

  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0
    const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviews.value.length).toFixed(1)
  })

  const totalReviews = computed(() => reviews.value.length)

  const filteredCount = computed(() => filteredReviews.value.length)

  const setRatingFilter = (rating) => {
    filters.rating = rating
    currentPage.value = 1
  }

  const setHasImagesFilter = (value) => {
    filters.hasImages = value
    currentPage.value = 1
  }

  const setKeyword = (keyword) => {
    filters.keyword = keyword
    currentPage.value = 1
  }

  const setSortBy = (value) => {
    sortBy.value = value
  }

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const resetFilters = () => {
    filters.rating = null
    filters.hasImages = false
    filters.keyword = ''
    currentPage.value = 1
  }

  const setPageSize = (size) => {
    pageSize.value = size
    currentPage.value = 1
  }

  const addReview = (review) => {
    reviews.value.push({
      id: `review-${Date.now()}`,
      createTime: new Date().toISOString(),
      helpfulCount: 0,
      ...review
    })
  }

  const removeReview = (reviewId) => {
    const index = reviews.value.findIndex(r => r.id === reviewId)
    if (index !== -1) {
      reviews.value.splice(index, 1)
    }
  }

  const markHelpful = (reviewId) => {
    const review = reviews.value.find(r => r.id === reviewId)
    if (review) {
      review.helpfulCount = (review.helpfulCount || 0) + 1
    }
  }

  const getFilterSummary = computed(() => {
    const parts = []

    if (filters.rating !== null) {
      parts.push(`${filters.rating}星评价`)
    }

    if (filters.hasImages) {
      parts.push('有图评价')
    }

    if (filters.keyword.trim()) {
      parts.push(`包含"${filters.keyword}"`)
    }

    return parts.length > 0 ? parts.join('，') : '全部评价'
  })

  return {
    reviews,
    filters,
    sortBy,
    currentPage,
    pageSize,
    filteredReviews,
    sortedReviews,
    paginatedReviews,
    totalPages,
    ratingDistribution,
    averageRating,
    totalReviews,
    filteredCount,
    setRatingFilter,
    setHasImagesFilter,
    setKeyword,
    setSortBy,
    setPage,
    nextPage,
    prevPage,
    resetFilters,
    setPageSize,
    addReview,
    removeReview,
    markHelpful,
    getFilterSummary
  }
}
