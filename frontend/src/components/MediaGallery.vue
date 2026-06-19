<template>
  <div class="media-gallery">
    <div class="gallery-main">
      <div class="main-display" @click="openFullscreen">
        <transition name="fade" mode="out-in">
          <div v-if="currentMedia" :key="currentMedia.id" class="media-container">
            <img
              v-if="currentMedia.type === 'image'"
              :src="currentMedia.url"
              :alt="currentMedia.alt || '商品图片'"
              class="main-image"
            />
            <div v-else-if="currentMedia.type === 'video'" class="video-wrapper">
              <video
                ref="mainVideo"
                :src="currentMedia.url"
                class="main-video"
                :poster="currentMedia.poster"
                controls
                playsinline
              ></video>
            </div>
          </div>
        </transition>
        
        <div class="navigation-arrows" v-if="mediaList.length > 1">
          <button class="nav-btn prev" @click.stop="prevMedia" :disabled="currentIndex === 0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button class="nav-btn next" @click.stop="nextMedia" :disabled="currentIndex === mediaList.length - 1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div class="fullscreen-hint">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
          <span>点击全屏</span>
        </div>
      </div>

      <div class="thumbnail-strip">
        <div class="thumbnails-container" ref="thumbnailContainer">
          <button
            v-for="(media, index) in mediaList"
            :key="media.id"
            class="thumbnail-item"
            :class="{ active: index === currentIndex, 'is-video': media.type === 'video' }"
            @click="selectMedia(index)"
          >
            <img v-if="media.type === 'image'" :src="media.url" :alt="media.alt || ''" />
            <div v-else-if="media.type === 'video'" class="video-thumb">
              <img v-if="media.poster" :src="media.poster" alt="视频封面" />
              <div v-else class="video-placeholder">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>
          </button>
        </div>

        <div class="upload-section">
          <label class="upload-btn">
            <input
              type="file"
              ref="videoInput"
              accept="video/*"
              @change="handleVideoUpload"
              hidden
            />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>上传视频</span>
          </label>
        </div>
      </div>

      <div class="media-counter" v-if="mediaList.length > 1">
        <span class="current">{{ currentIndex + 1 }}</span>
        <span class="separator">/</span>
        <span class="total">{{ mediaList.length }}</span>
      </div>
    </div>

    <Teleport to="body">
      <transition name="fullscreen">
        <div v-if="isFullscreen" class="fullscreen-overlay" @click="closeFullscreen">
          <div class="fullscreen-content" @click.stop>
            <button class="close-btn" @click="closeFullscreen">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="fullscreen-media">
              <transition name="fade" mode="out-in">
                <img
                  v-if="currentMedia && currentMedia.type === 'image'"
                  :key="currentMedia.id"
                  :src="currentMedia.url"
                  :alt="currentMedia.alt || '商品图片'"
                  class="fullscreen-image"
                />
                <video
                  v-else-if="currentMedia && currentMedia.type === 'video'"
                  :key="currentMedia.id"
                  :src="currentMedia.url"
                  class="fullscreen-video"
                  controls
                  autoplay
                  playsinline
                ></video>
              </transition>
            </div>

            <div class="fullscreen-nav" v-if="mediaList.length > 1">
              <button class="fullscreen-nav-btn prev" @click="prevMedia" :disabled="currentIndex === 0">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button class="fullscreen-nav-btn next" @click="nextMedia" :disabled="currentIndex === mediaList.length - 1">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>

            <div class="fullscreen-thumbnails" v-if="mediaList.length > 1">
              <button
                v-for="(media, index) in mediaList"
                :key="media.id"
                class="fullscreen-thumb"
                :class="{ active: index === currentIndex }"
                @click="selectMedia(index)"
              >
                <img v-if="media.type === 'image'" :src="media.url" :alt="media.alt || ''" />
                <div v-else class="video-thumb-small">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <div v-if="isUploading" class="upload-progress-overlay">
      <div class="upload-progress-card">
        <div class="upload-spinner"></div>
        <p class="upload-text">视频上传中...</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <span class="progress-percent">{{ uploadProgress }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  initialMedia: {
    type: Array,
    default: () => []
  },
  productId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['media-uploaded', 'media-error'])

const mediaList = ref([...props.initialMedia])
const currentIndex = ref(0)
const isFullscreen = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const videoInput = ref(null)
const mainVideo = ref(null)
const thumbnailContainer = ref(null)

const currentMedia = computed(() => mediaList.value[currentIndex.value])

const selectMedia = (index) => {
  currentIndex.value = index
}

const prevMedia = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextMedia = () => {
  if (currentIndex.value < mediaList.value.length - 1) {
    currentIndex.value++
  }
}

const openFullscreen = () => {
  isFullscreen.value = true
  document.body.style.overflow = 'hidden'
}

const closeFullscreen = () => {
  isFullscreen.value = false
  document.body.style.overflow = ''
}

const handleVideoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
  if (!validTypes.includes(file.type)) {
    emit('media-error', { message: '请上传 MP4、WebM 或 MOV 格式的视频' })
    return
  }

  if (file.size > 100 * 1024 * 1024) {
    emit('media-error', { message: '视频大小不能超过 100MB' })
    return
  }

  isUploading.value = true
  uploadProgress.value = 0

  try {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('productId', props.productId)

    const response = await axios.post('/api/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    })

    const newVideo = {
      id: `video-${Date.now()}`,
      type: 'video',
      url: response.data.url,
      poster: response.data.poster || null,
      alt: '商品视频'
    }

    mediaList.value.push(newVideo)
    currentIndex.value = mediaList.value.length - 1

    emit('media-uploaded', { media: newVideo, response: response.data })
  } catch (error) {
    console.error('视频上传失败:', error)
    emit('media-error', { message: error.response?.data?.message || '视频上传失败，请重试' })
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
    event.target.value = ''
  }
}

const handleKeydown = (event) => {
  if (!isFullscreen.value) return

  switch (event.key) {
    case 'Escape':
      closeFullscreen()
      break
    case 'ArrowLeft':
      prevMedia()
      break
    case 'ArrowRight':
      nextMedia()
      break
  }
}

watch(currentIndex, (newIndex) => {
  if (mainVideo.value) {
    mainVideo.value.pause()
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.media-gallery {
  position: relative;
  width: 100%;
}

.gallery-main {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.main-display {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: linear-gradient(145deg, #faf9f6 0%, #f0efe9 100%);
  cursor: pointer;
  overflow: hidden;
}

.media-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform var(--transition-smooth);
}

.main-display:hover .main-image {
  transform: scale(1.02);
}

.video-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.main-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.navigation-arrows {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  pointer-events: none;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
  color: var(--color-primary);
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-surface);
  transform: scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.fullscreen-hint {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-muted);
  opacity: 0;
  transform: translateY(8px);
  transition: all var(--transition-fast);
}

.main-display:hover .fullscreen-hint {
  opacity: 1;
  transform: translateY(0);
}

.thumbnail-strip {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.thumbnails-container {
  display: flex;
  gap: 10px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.thumbnails-container::-webkit-scrollbar {
  height: 4px;
}

.thumbnails-container::-webkit-scrollbar-track {
  background: transparent;
}

.thumbnails-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

.thumbnail-item {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-bg);
  padding: 0;
}

.thumbnail-item:hover {
  border-color: var(--color-accent);
}

.thumbnail-item.active {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(201, 169, 98, 0.3);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-thumb {
  width: 100%;
  height: 100%;
  position: relative;
}

.video-thumb img {
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

.thumbnail-item.is-video::after {
  content: '';
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-section {
  display: flex;
  align-items: center;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  color: #fff;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(201, 169, 98, 0.4);
}

.media-counter {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: var(--radius-sm);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(8px);
}

.media-counter .separator {
  opacity: 0.6;
}

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-overlay);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.fullscreen-content {
  position: relative;
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: -50px;
  right: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.fullscreen-media {
  max-width: 100%;
  max-height: calc(90vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-image {
  max-width: 100%;
  max-height: calc(90vh - 120px);
  object-fit: contain;
  border-radius: var(--radius-md);
}

.fullscreen-video {
  max-width: 100%;
  max-height: calc(90vh - 120px);
  border-radius: var(--radius-md);
}

.fullscreen-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: none;
}

.fullscreen-nav-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  color: #fff;
  transition: all var(--transition-fast);
}

.fullscreen-nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.fullscreen-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.fullscreen-thumbnails {
  position: absolute;
  bottom: 0;
  display: flex;
  gap: 12px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: var(--radius-md);
  backdrop-filter: blur(8px);
}

.fullscreen-thumb {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
  background: transparent;
}

.fullscreen-thumb:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.fullscreen-thumb.active {
  border-color: var(--color-accent);
}

.fullscreen-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-thumb-small {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3d3d3d 0%, #2a2a2a 100%);
  color: var(--color-accent);
}

.upload-progress-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.upload-progress-card {
  background: var(--color-surface);
  padding: 40px 50px;
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.upload-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upload-text {
  font-size: 16px;
  color: var(--color-text);
  margin-bottom: 20px;
}

.progress-bar {
  width: 240px;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-percent {
  font-size: 14px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fullscreen-enter-active,
.fullscreen-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fullscreen-enter-from,
.fullscreen-leave-to {
  opacity: 0;
}

.fullscreen-enter-from .fullscreen-content,
.fullscreen-leave-to .fullscreen-content {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .thumbnail-strip {
    flex-direction: column;
    gap: 12px;
  }

  .thumbnails-container {
    justify-content: flex-start;
  }

  .upload-section {
    width: 100%;
  }

  .upload-btn {
    width: 100%;
    justify-content: center;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
  }

  .fullscreen-nav-btn {
    width: 44px;
    height: 44px;
  }

  .fullscreen-thumbnails {
    gap: 8px;
    padding: 12px;
  }

  .fullscreen-thumb {
    width: 48px;
    height: 48px;
  }
}
</style>
