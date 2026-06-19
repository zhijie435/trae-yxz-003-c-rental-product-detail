# C端租赁商品详情项目

基于 Vue 3 + Vite 的租赁商品详情页，包含规格选择、押金计算、用户评价筛选和视频上传功能。

## 项目结构

```
├── frontend/                 # Vue 3 前端项目
│   ├── src/
│   │   ├── components/      # Vue 组件
│   │   │   ├── MediaGallery.vue         # 媒体画廊组件
│   │   │   ├── ProductCoreInfo.vue      # 核心信息组件
│   │   │   ├── ServicePromise.vue        # 服务承诺组件
│   │   │   ├── SpecificationSelector.vue # 规格选择组件
│   │   │   ├── UserReviews.vue           # 用户评价组件
│   │   │   └── BottomActionBar.vue       # 底部操作栏
│   │   ├── composables/      # 组合式函数
│   │   │   ├── useRentalSelection.js     # 租期规格选择
│   │   │   ├── useDepositCalculation.js  # 押金计算
│   │   │   ├── useReviewFilter.js        # 评价筛选
│   │   │   └── useRentalRedirect.js      # 立即租赁跳转
│   │   ├── views/            # 页面视图
│   │   ├── router/           # 路由配置
│   │   └── styles/           # 样式文件
│   └── package.json
│
└── server/                   # Express 后端服务
    ├── index.js              # 服务端入口
    └── package.json
```

## 本地启动说明

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 启动步骤

#### 1. 启动后端服务（视频上传服务）

```bash
cd server
npm install
npm run dev
```

后端服务运行在 `http://localhost:3001`

#### 2. 启动前端开发服务器

```bash
cd frontend
npm install
npm run dev
```

前端应用运行在 `http://localhost:5173`

#### 3. 访问应用

在浏览器中打开 `http://localhost:5173`

## 商品素材配置

### 图片素材

本项目使用 [Unsplash](https://unsplash.com/) 免费图片作为商品展示素材。

#### 当前商品配置

```javascript
// 商品ID
productId: 'product-001'

// 商品图片（可在 App.vue 中修改）
demoMedia: [
  {
    id: 'img-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    alt: '沙发正面展示'
  },
  {
    id: 'img-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    alt: '沙发侧面展示'
  },
  {
    id: 'img-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    alt: '沙发细节展示'
  }
]
```

#### 更换商品图片

1. 访问 [Unsplash](https://unsplash.com/) 搜索合适的商品图片
2. 复制图片 URL
3. 在 `frontend/src/App.vue` 中修改 `demoMedia` 数组
4. 图片 URL 格式建议：`https://images.unsplash.com/{photo-id}?w=800&q=80`

#### 推荐的 Unsplash 图片 ID

| 商品类型 | 图片 ID | 描述 |
|---------|---------|------|
| 沙发 | `photo-1555041469-a586c61ea9bc` | 现代灰色沙发 |
| 沙发 | `photo-1493663284031-b7e3aefcae8e` | 浅色布艺沙发 |
| 沙发 | `photo-1506439773649-6e0eb8cfb237` | 棕色皮质沙发 |
| 床 | `photo-1505693416388-ac5ce068fe85` | 现代双人床 |
| 餐桌 | `photo-1617806118233-18e1de247200` | 木质餐桌 |
| 椅子 | `photo-1598300042247-d088f8ab3a91` | 现代餐椅 |
| 书柜 | `photo-1594620302200-9a762244a156` | 简约书柜 |
| 茶几 | `photo-1532372320572-cda25653a26d` | 现代茶几 |

## 规格种子数据

### 基础配置

```javascript
// 基础月租价格
basePrice: 199  // 元/月

// 基础押金
baseDeposit: 800  // 元
```

### 租期规格

| 租期 | 月数 | 月租价格 | 总租金 | 押金 |
|------|------|----------|--------|------|
| 短期租 | 3 个月 | ¥199/月 | ¥597 | ¥800 |
| 中期租 | 6 个月 | ¥179/月 | ¥1074 | ¥800 |
| 长期租 | 12 个月 | ¥159/月 | ¥1908 | ¥800 |

### 颜色规格

| 颜色名称 | 颜色值 | 押金调整 |
|---------|--------|----------|
| 经典灰 | `#808080` | +¥0 |
| 米白色 | `#F5F5DC` | +¥0 |
| 高级灰 | `#4A4A4A` | +¥100 |
| 复古棕 | `#8B4513` | +¥150 |

### 尺寸规格

| 尺寸名称 | 宽度 | 价格调整 | 押金调整 |
|---------|------|----------|----------|
| 单人位 | 80cm | +¥0 | +¥0 |
| 双人位 | 140cm | +¥50 | +¥200 |
| 三人位 | 200cm | +¥100 | +¥400 |
| L型沙发 | 280cm | +¥200 | +¥600 |

### 配送方式

| 配送方式 | 配送费 | 描述 |
|---------|--------|------|
| 到店自提 | ¥0 | 前往门店自提 |
| 普通配送 | ¥99 | 3-5个工作日送达 |
| 急速配送 | ¥199 | 次日达（限城市） |

### 示例订单数据

```javascript
// 完整订单配置示例
{
  productId: 'product-001',
  rentalConfig: {
    period: 6,        // 6个月租期
    color: '#808080', // 经典灰
    size: 'double',  // 双人位
    delivery: 'express' // 普通配送
  },
  pricing: {
    monthlyPrice: 179,     // 月租价格
    deposit: 1000,         // 押金（含尺寸调整）
    deliveryFee: 99,        // 配送费
    subtotal: 1074,        // 租金小计
    total: 2173            // 总金额
  },
  labels: {
    periodLabel: '6个月',
    colorName: '经典灰',
    sizeName: '双人位 140cm',
    deliveryName: '普通配送'
  }
}
```

## 用户评价数据

### 评价数据结构

```javascript
{
  id: 'review-1',
  reviewerName: '张女士',
  avatar: 'https://images.unsplash.com/photo-xxx?w=100&q=80',
  rating: 5,  // 1-5星
  date: '2024-01-15',
  tags: ['品质优良', '外观时尚'],
  content: '评价内容...',
  images: [
    'https://images.unsplash.com/photo-xxx?w=300&q=80'
  ]
}
```

### 评价筛选功能

支持以下筛选条件：
- 按评分筛选（1-5星）
- 仅显示带图评价
- 关键词搜索
- 排序方式：最新优先、评分最高、评分最低

## 视频上传功能

后端服务支持 MP4、WebM、MOV 格式视频上传：

- 上传端点：`POST http://localhost:3001/api/upload/video`
- 文件大小限制：100MB
- 上传后访问：`http://localhost:3001/uploads/{filename}`

## 测试

前端项目包含完整的单元测试：

```bash
cd frontend

# 运行所有测试
npm run test:run

# 查看测试覆盖率
npm run test:coverage

# 监听模式
npm run test:watch
```

### 测试覆盖

| 模块 | 测试数量 | 描述 |
|------|----------|------|
| useRentalSelection | 24个 | 租期规格选择 |
| useDepositCalculation | 23个 | 押金计算 |
| useReviewFilter | 52个 | 评价筛选 |
| useRentalRedirect | 23个 | 立即租赁跳转 |

## 端口配置

| 服务 | 端口 | 环境变量 |
|------|------|----------|
| 前端开发服务器 | 5173 | `VITE_PORT` |
| 后端API服务 | 3001 | `PORT` |

## 环境变量

### 前端 (.env)

```
VITE_PORT=5173
```

### 后端 (.env)

```
PORT=3001
```

## 技术栈

- **前端**: Vue 3 + Vite + Vue Router
- **后端**: Express.js + Multer
- **测试**: Vitest + Vue Test Utils
- **样式**: CSS Variables + 原生 CSS

## 开发指南

### 添加新组件

1. 在 `frontend/src/components/` 创建 `.vue` 文件
2. 在需要的页面中导入使用
3. 如需共享状态，使用 `provide/inject` 或 Pinia

### 添加新的规格选项

修改 `frontend/src/composables/useRentalSelection.js` 中的配置对象：

```javascript
const config = {
  periods: [...],   // 租期选项
  colors: [...],    // 颜色选项
  sizes: [...],     // 尺寸选项
  deliveries: [...] // 配送选项
}
```

### 修改押金计算规则

在 `frontend/src/composables/useDepositCalculation.js` 中调整计算逻辑。

## 许可证

Private Project - All Rights Reserved
