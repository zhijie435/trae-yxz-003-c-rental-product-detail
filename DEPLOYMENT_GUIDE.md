# 快速部署指南

## 一、项目启动

### 1. 安装依赖

```bash
# 后端服务
cd server
npm install

# 前端应用
cd frontend
npm install
```

### 2. 启动服务

```bash
# 终端1：启动后端（视频上传服务）
cd server
npm run dev
# 服务地址：http://localhost:3001

# 终端2：启动前端
cd frontend
npm run dev
# 服务地址：http://localhost:5173
```

### 3. 访问应用

浏览器打开：`http://localhost:5173`

---

## 二、更换商品素材

### 方法1：修改配置文件

1. 打开 `frontend/src/data/productSeed.js`
2. 修改 `media` 数组中的图片信息

```javascript
media: [
  {
    id: 'img-1',
    type: 'image',
    url: '你的图片URL',
    alt: '图片描述'
  }
]
```

### 方法2：直接修改 App.vue

在 `frontend/src/App.vue` 中找到 `demoMedia`：

```javascript
const demoMedia = ref([
  {
    id: 'img-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-你的图片ID?w=800&q=80',
    alt: '你的图片描述'
  }
])
```

### 获取图片 URL

1. 访问 [Unsplash](https://unsplash.com/)
2. 搜索想要的图片
3. 点击图片 → 点击 "Download free" → 复制 URL
4. 将 URL 中的尺寸参数调整为 `?w=800&q=80`

---

## 三、修改商品规格

### 1. 修改租期选项

在 `frontend/src/data/productSeed.js` 中修改 `periods`：

```javascript
periods: [
  {
    id: 'short',
    name: '3个月',
    months: 3,
    monthlyPrice: 199,  // 月租价格
    description: '短期租赁'
  }
]
```

### 2. 修改颜色选项

```javascript
colors: [
  {
    id: 'classic-gray',
    name: '经典灰',
    value: '#808080',  // 颜色值
    depositAdjustment: 0  // 押金调整
  }
]
```

### 3. 修改尺寸选项

```javascript
sizes: [
  {
    id: 'double',
    name: '双人位',
    width: '140cm',
    priceAdjustment: 50,  // 价格调整
    depositAdjustment: 200  // 押金调整
  }
]
```

### 4. 修改配送方式

```javascript
deliveries: [
  {
    id: 'express',
    name: '急速配送',
    fee: 199,  // 配送费用
    description: '次日达',
    estimatedDays: '次日'
  }
]
```

---

## 四、修改评价数据

### 添加新评价

在 `frontend/src/data/productSeed.js` 的 `reviews` 数组中添加：

```javascript
{
  id: 'review-new',
  reviewerName: '用户名',
  avatar: 'https://图片URL',
  rating: 5,  // 1-5星
  date: '2024-01-01',
  tags: ['标签1', '标签2'],
  content: '评价内容...',
  images: []  // 可添加图片
}
```

---

## 五、修改基础定价

### 修改月租价格和押金

在 `App.vue` 中：

```javascript
// 基础月租价格
const basePrice = 199  // 改为你的价格

// 基础押金
const baseDeposit = 800  // 改为你的押金
```

或在 `SpecificationSelector.vue` 组件中：

```html
<SpecificationSelector
  :base-price="199"
  :base-deposit="800"
/>
```

---

## 六、视频上传测试

### 上传视频

1. 点击媒体画廊中的"上传视频"按钮
2. 选择 MP4、WebM 或 MOV 格式的视频
3. 视频将上传到 `server/uploads/` 目录
4. 上传成功后，视频将自动添加到商品媒体列表

### 验证上传

后端服务运行后，访问：`http://localhost:3001/uploads/`

---

## 七、常见问题

### Q: 前端无法访问后端 API？

检查后端服务是否运行在 `http://localhost:3001`

### Q: 图片无法显示？

1. 确认图片 URL 可访问
2. 检查 CORS 配置
3. 尝试使用 Unsplash 的标准 URL 格式

### Q: 视频上传失败？

1. 检查文件格式（仅支持 MP4、WebM、MOV）
2. 检查文件大小（最大 100MB）
3. 检查后端服务是否正常运行

### Q: 押金计算不正确？

检查 `useDepositCalculation.js` 中的计算逻辑

---

## 八、部署到生产环境

### 1. 前端构建

```bash
cd frontend
npm run build
```

构建产物在 `frontend/dist/` 目录

### 2. 后端部署

```bash
cd server
npm start
```

### 3. 环境变量配置

创建 `.env` 文件：

```
# 后端
PORT=3001

# 前端
VITE_API_BASE_URL=https://your-api-domain.com
```

---

## 九、测试

### 运行单元测试

```bash
cd frontend
npm run test:run
```

### 生成测试覆盖率报告

```bash
npm run test:coverage
```

---

## 十、联系支持

如有问题，请联系开发团队。
