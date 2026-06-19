# 单元测试说明

## 测试概述

本项目包含针对租期规格选择、押金计算、评价筛选和立即租赁跳转功能的完整单元测试。

## 测试文件

1. **租期规格选择测试** - `src/composables/useRentalSelection.test.js`
   - 24个测试用例
   - 覆盖租期、颜色、尺寸、配送方式的选择功能
   - 测试历史记录和撤销功能
   - 测试验证和重置功能

2. **押金计算测试** - `src/composables/useDepositCalculation.test.js`
   - 23个测试用例
   - 测试基础押金计算
   - 测试尺寸对押金的影响
   - 测试最小押金限制（500元）
   - 测试租金小计、配送费和总金额计算

3. **评价筛选测试** - `src/composables/useReviewFilter.test.js`
   - 52个测试用例
   - 测试按评分筛选
   - 测试按是否有图片筛选
   - 测试关键词搜索
   - 测试排序功能（最新、评分最高、最有帮助等）
   - 测试分页功能
   - 测试评分统计（平均分、分布等）
   - 测试评价管理（添加、删除、标记有帮助）

4. **立即租赁跳转测试** - `src/composables/useRentalRedirect.test.js`
   - 23个测试用例
   - 测试租赁验证
   - 测试租赁摘要生成
   - 测试完整的租赁流程
   - 测试错误处理
   - 测试状态追踪

## 运行测试

### 运行所有测试
```bash
npm run test
```

### 运行测试（一次性）
```bash
npm run test:run
```

### 运行测试覆盖率报告
```bash
npm run test:coverage
```

### 运行特定文件的测试
```bash
npx vitest run src/composables/useRentalSelection.test.js
```

### 监视模式（开发时使用）
```bash
npm run test:watch
```

## 测试结果

**总计**: 122个测试用例，全部通过

### 覆盖率统计

- **useRentalSelection.js**: 98.75% 语句覆盖率, 89.47% 分支覆盖率
- **useReviewFilter.js**: 100% 语句覆盖率, 94.54% 分支覆盖率
- **composables整体**: 99.26% 语句覆盖率, 91.96% 分支覆盖率

## 测试特性

1. **隔离性**: 每个测试使用 `beforeEach` 确保环境干净
2. **描述性**: 测试用例使用中文描述，清晰易懂
3. **全面性**: 覆盖正常流程、边界条件、异常处理
4. **可维护性**: 测试逻辑清晰，便于后续扩展

## 添加新测试

1. 在对应的 `.test.js` 文件中添加测试用例
2. 使用 `describe` 分组相关测试
3. 使用 `it` 或 `test` 定义具体测试用例
4. 确保测试独立，不依赖其他测试的执行顺序

## 测试工具

- **测试框架**: Vitest
- **Vue组件测试**: @vue/test-utils
- **DOM模拟**: jsdom
- **覆盖率**: @vitest/coverage-v8
