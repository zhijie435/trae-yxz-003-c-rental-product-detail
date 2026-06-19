<template>
  <div class="user-reviews">
    <div class="reviews-header">
      <div class="rating-summary">
        <div class="rating-score">
          <span class="score-value">{{ averageRating }}</span>
          <span class="score-label">分</span>
        </div>
        <div class="rating-details">
          <div class="rating-stars">
            <svg
              v-for="star in 5"
              :key="star"
              class="star-icon"
              :class="{ filled: star <= Math.round(averageRating) }"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="rating-count">{{ totalReviews }} 条评价</div>
        </div>
      </div>

      <div class="rating-distribution">
        <div
          v-for="(count, rating) in displayDistribution"
          :key="rating"
          class="distribution-item"
          :class="{ active: filters.rating === parseInt(rating) }"
          @click="toggleRatingFilter(parseInt(rating))"
        >
          <span class="star-label">{{ rating }}星</span>
          <div class="distribution-bar">
            <div
              class="bar-fill"
              :style="{ width: totalReviews > 0 ? (count / totalReviews * 100) + '%' : '0%' }"
            ></div>
          </div>
          <span class="distribution-count">{{ count }}</span>
        </div>
      </div>
    </div>

    <div class="reviews-toolbar">
      <div class="filter-section">
        <div class="filter-group">
          <label class="filter-label">筛选条件</label>
          <div class="filter-chips">
            <button
              v-for="option in REVIEW_SORT_OPTIONS"
              :key="option.value"
              class="chip"
              :class="{ active: sortBy === option.value }"
              @click="setSortBy(option.value)"
            >
              <span class="chip-icon">{{ option.icon }}</span>
              <span>{{ option.label }}</span>
            </button>
          </div>
        </div>

        <button
          class="filter-toggle"
          :class="{ active: filters.hasMedia }"
          @click="toggleMediaFilter"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>有图/视频</span>
        </button>

        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索评价内容..."
            class="search-input"
            @input="handleSearch"
          />
          <button v-if="searchKeyword" class="clear-search" @click="clearSearch">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="filter-status" v-if="hasActiveFilters">
        <span class="filter-summary">{{ getFilterSummary }}</span>
        <button class="reset-btn" @click="resetFilters">重置</button>
      </div>
    </div>

    <div class="reviews-list" v-if="paginatedReviews.length > 0">
      <TransitionGroup name="review-item">
        <div
          v-for="review in paginatedReviews"
          :key="review.id"
          class="review-card"
          @mouseenter="hoveredReview = review.id"
          @mouseleave="hoveredReview = null"
        >
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">
                <img :src="review.avatar" :alt="review.reviewerName" />
              </div>
              <div class="reviewer-details">
                <div class="reviewer-name">{{ review.reviewerName }}</div>
                <div class="review-date">{{ formatDate(review.date) }}</div>
              </div>
            </div>
            <div class="review-rating">
              <svg
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ filled: star <= review.rating }"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>

          <div class="review-tags" v-if="review.tags && review.tags.length">
            <span v-for="tag in review.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="review-content">
            <p>{{ review.content }}</p>
          </div>

          <div class="review-media" v-if="review.images && review.images.length > 0">
            <div class="media-grid" :class="{ 'has-video': hasVideo(review) }">
              <div
                v-for="(media, index) in review.images"
                :key="index"
                class="media-item"
                :class="{ 'is-video': isVideoMedia(media) }"
                @click="openLightbox(review, index)"
              >
                <img v-if="!isVideoMedia(media)" :src="media" :alt="'评价图片' + (index + 1)" />
                <div v-else class="video-thumbnail">
                  <img v-if="media.thumbnail" :src="media.thumbnail" :alt="'评价视频' + (index + 1)" />
                  <div v-else class="video-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                  <div class="video-duration" v-if="media.duration">{{ formatDuration(media.duration) }}</div>
                </div>
                <div class="media-overlay">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/>
                    <path d="M3 16.2V21h4.8"/>
                    <path d="M21 7.8V3h-4.8"/>
                    <path d="M3 7.8V3h4.8"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="review-actions">
            <button
              class="action-btn helpful"
              :class="{ voted: votedReviews.has(review.id) }"
              @click="handleHelpful(review.id)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="votedReviews.has(review.id) ? 'currentColor' : 'none'" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
              <span>{{ review.helpfulCount || 0 }} 赞</span>
            </button>
            <button class="action-btn reply" @click="toggleReply(review.id)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>回复</span>
            </button>
            <button class="action-btn share" @click="shareReview(review)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <span>分享</span>
            </button>
          </div>

          <Transition name="slide">
            <div v-if="activeReply === review.id" class="reply-section">
              <textarea
                v-model="replyText"
                placeholder="写下你的回复..."
                class="reply-input"
                rows="3"
              ></textarea>
              <div class="reply-actions">
                <button class="cancel-btn" @click="activeReply = null">取消</button>
                <button class="submit-btn" @click="submitReply(review.id)">提交回复</button>
              </div>
            </div>
          </Transition>
        </div>
      </TransitionGroup>
    </div>

    <div v-else class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
      <p class="empty-text">暂无符合条件的评价</p>
      <button class="reset-btn" @click="resetFilters">查看全部评价</button>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage, ellipsis: page === '...' }"
        :disabled="page === '...'"
        @click="page !== '...' && setPage(page)"
      >
        {{ page }}
      </button>

      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <span class="page-info">
        第 {{ currentPage }} / {{ totalPages }} 页
      </span>
    </div>

    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightbox.show" class="lightbox-overlay" @click="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <button
            v-if="lightbox.review?.images?.length > 1"
            class="lightbox-nav prev"
            @click.stop="prevLightboxMedia"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div class="lightbox-content" @click.stop>
            <Transition name="lightbox-fade" mode="out-in">
              <div v-if="lightbox.currentMedia" :key="lightbox.index" class="lightbox-media">
                <img
                  v-if="!isVideoMedia(lightbox.currentMedia)"
                  :src="lightbox.currentMedia"
                  alt="评价图片"
                  class="lightbox-image"
                />
                <video
                  v-else
                  :src="lightbox.currentMedia.url"
                  controls
                  autoplay
                  playsinline
                  class="lightbox-video"
                ></video>
              </div>
            </Transition>
          </div>

          <button
            v-if="lightbox.review?.images?.length > 1"
            class="lightbox-nav next"
            @click.stop="nextLightboxMedia"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          <div class="lightbox-counter">
            {{ lightbox.index + 1 }} / {{ lightbox.review?.images?.length || 0 }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useReviewFilter } from '../composables/useReviewFilter'

const props = defineProps({
  reviews: {
    type: Array,
    required: true
  }
})

const {
  filters,
  sortBy,
  currentPage,
  paginatedReviews,
  totalPages,
  ratingDistribution,
  averageRating,
  totalReviews,
  setRatingFilter,
  setHasMediaFilter,
  setKeyword,
  setSortBy,
  setPage,
  nextPage,
  prevPage,
  resetFilters,
  markHelpful,
  getFilterSummary
} = useReviewFilter(props.reviews)

const searchKeyword = ref('')
const hoveredReview = ref(null)
const votedReviews = ref(new Set())
const activeReply = ref(null)
const replyText = ref('')

const lightbox = reactive({
  show: false,
  review: null,
  index: 0,
  currentMedia: null
})

const hasActiveFilters = computed(() => {
  return filters.rating !== null ||
         filters.hasMedia ||
         filters.keyword.trim() !== ''
})

const displayDistribution = computed(() => {
  const dist = {}
  for (let i = 5; i >= 1; i--) {
    dist[i] = ratingDistribution.value[i] || 0
  }
  return dist
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    pages.push(total)
  }

  return pages
})

const toggleRatingFilter = (rating) => {
  if (filters.rating === rating) {
    setRatingFilter(null)
  } else {
    setRatingFilter(rating)
  }
}

const toggleMediaFilter = () => {
  setHasMediaFilter(!filters.hasMedia)
}

const handleSearch = () => {
  setKeyword(searchKeyword.value)
}

const clearSearch = () => {
  searchKeyword.value = ''
  setKeyword('')
}

const handleHelpful = (reviewId) => {
  if (votedReviews.value.has(reviewId)) {
    return
  }
  votedReviews.value.add(reviewId)
  markHelpful(reviewId)
}

const toggleReply = (reviewId) => {
  activeReply.value = activeReply.value === reviewId ? null : reviewId
  replyText.value = ''
}

const submitReply = (reviewId) => {
  console.log('Reply submitted:', replyText.value, 'for review:', reviewId)
  activeReply.value = null
  replyText.value = ''
}

const shareReview = (review) => {
  if (navigator.share) {
    navigator.share({
      title: '商品评价',
      text: review.content.substring(0, 100) + '...',
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(review.content)
  }
}

const isVideoMedia = (media) => {
  return typeof media === 'object' && media.type === 'video'
}

const hasVideo = (review) => {
  return review.images?.some(media => isVideoMedia(media))
}

const openLightbox = (review, index) => {
  lightbox.show = true
  lightbox.review = review
  lightbox.index = index
  lightbox.currentMedia = review.images[index]
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightbox.show = false
  document.body.style.overflow = ''
}

const prevLightboxMedia = () => {
  if (lightbox.index > 0) {
    lightbox.index--
    lightbox.currentMedia = lightbox.review.images[lightbox.index]
  }
}

const nextLightboxMedia = () => {
  if (lightbox.index < lightbox.review.images.length - 1) {
    lightbox.index++
    lightbox.currentMedia = lightbox.review.images[lightbox.index]
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}
</script>

<style scoped>
.user-reviews {
  margin-top: 48px;
  padding: 32px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.reviews-header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 48px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 24px;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 20px;
}

.rating-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-value {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-accent);
  font-family: var(--font-display);
  line-height: 1;
}

.score-label {
  font-size: 20px;
  color: var(--color-text-muted);
}

.rating-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-stars {
  display: flex;
  gap: 4px;
}

.star-icon {
  color: var(--color-border);
  transition: color var(--transition-fast);
}

.star-icon.filled {
  color: var(--color-accent);
}

.rating-count {
  font-size: 14px;
  color: var(--color-text-muted);
}

.rating-distribution {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.distribution-item {
  display: grid;
  grid-template-columns: 50px 1fr 40px;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.distribution-item:hover {
  background: var(--color-bg);
}

.distribution-item.active {
  background: rgba(201, 169, 98, 0.1);
}

.star-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.distribution-bar {
  height: 8px;
  background: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  border-radius: 4px;
  transition: width var(--transition-smooth);
}

.distribution-count {
  font-size: 13px;
  color: var(--color-text);
  text-align: right;
}

.reviews-toolbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-size: 14px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.filter-chips {
  display: flex;
  gap: 8px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.chip:hover {
  border-color: var(--color-accent);
}

.chip.active {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}

.chip-icon {
  font-size: 14px;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-toggle:hover {
  border-color: var(--color-accent);
}

.filter-toggle.active {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  flex: 1;
  max-width: 300px;
  margin-left: auto;
}

.search-box svg {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--color-text);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.clear-search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: var(--color-border);
  border-radius: 50%;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.clear-search:hover {
  background: var(--color-text-muted);
  color: #fff;
}

.filter-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-sm);
}

.filter-summary {
  font-size: 14px;
  color: var(--color-accent);
}

.reset-btn {
  padding: 6px 16px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reset-btn:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-card {
  padding: 24px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.review-card:hover {
  box-shadow: var(--shadow-sm);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.reviewer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reviewer-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.review-date {
  font-size: 13px;
  color: var(--color-text-muted);
}

.review-rating {
  display: flex;
  gap: 2px;
}

.star {
  color: var(--color-border);
}

.star.filled {
  color: var(--color-accent);
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  padding: 4px 12px;
  background: rgba(201, 169, 98, 0.1);
  color: var(--color-accent);
  border-radius: 12px;
  font-size: 12px;
}

.review-content {
  margin-bottom: 16px;
}

.review-content p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text);
}

.review-media {
  margin-bottom: 16px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.media-grid.has-video {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.media-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
}

.media-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-smooth);
}

.media-item:hover img {
  transform: scale(1.05);
}

.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-fast);
  color: #fff;
}

.media-item:hover .media-overlay {
  opacity: 1;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  position: relative;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
  color: var(--color-accent);
}

.video-duration {
  position: absolute;
  bottom: 6px;
  right: 6px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  font-size: 11px;
  color: #fff;
}

.review-actions {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  font-size: 13px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.action-btn.helpful.voted {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}

.reply-section {
  margin-top: 16px;
  padding: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
}

.reply-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  transition: border-color var(--transition-fast);
}

.reply-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.cancel-btn {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cancel-btn:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.submit-btn {
  padding: 8px 20px;
  background: var(--color-accent);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.submit-btn:hover {
  background: var(--color-accent-hover);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
  text-align: center;
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

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled):not(.ellipsis) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.page-btn.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn.ellipsis {
  border: none;
  cursor: default;
}

.page-info {
  margin-left: 16px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.lightbox-nav:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.lightbox-nav.prev {
  left: 20px;
}

.lightbox-nav.next {
  right: 20px;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.lightbox-video {
  max-width: 100%;
  max-height: 90vh;
  border-radius: var(--radius-md);
}

.lightbox-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 14px;
  color: #fff;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.review-item-enter-active,
.review-item-leave-active {
  transition: all 0.3s ease;
}

.review-item-enter-from,
.review-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: all 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .user-reviews {
    margin-top: 32px;
    padding: 20px;
  }

  .reviews-header {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .rating-summary {
    justify-content: center;
  }

  .rating-distribution {
    padding: 0 12px;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-chips {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .search-box {
    max-width: none;
    margin-left: 0;
  }

  .media-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .media-grid.has-video {
    grid-template-columns: repeat(2, 1fr);
  }

  .review-actions {
    flex-wrap: wrap;
  }

  .lightbox-nav {
    width: 44px;
    height: 44px;
  }

  .lightbox-nav.prev {
    left: 10px;
  }

  .lightbox-nav.next {
    right: 10px;
  }
}
</style>
