/**
 * 商品种子数据配置文件
 * 包含商品信息、规格配置、评价数据等
 * 使用方法：在 App.vue 中导入并使用
 */

export const PRODUCT_SEED_DATA = {
  productId: 'product-001',
  
  productName: '设计师款北欧风沙发',
  
  brand: '宜家经典',
  
  model: 'KIVIK 奇维系列',
  
  salesCount: '2,847',
  
  rating: '98.5%',
  
  basePrice: 199,
  
  baseDeposit: 800,
  
  media: [
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
  ],
  
  colors: [
    {
      id: 'classic-gray',
      name: '经典灰',
      value: '#808080',
      depositAdjustment: 0
    },
    {
      id: 'cream-white',
      name: '米白色',
      value: '#F5F5DC',
      depositAdjustment: 0
    },
    {
      id: 'premium-gray',
      name: '高级灰',
      value: '#4A4A4A',
      depositAdjustment: 100
    },
    {
      id: 'vintage-brown',
      name: '复古棕',
      value: '#8B4513',
      depositAdjustment: 150
    }
  ],
  
  sizes: [
    {
      id: 'single',
      name: '单人位',
      width: '80cm',
      priceAdjustment: 0,
      depositAdjustment: 0
    },
    {
      id: 'double',
      name: '双人位',
      width: '140cm',
      priceAdjustment: 50,
      depositAdjustment: 200
    },
    {
      id: 'triple',
      name: '三人位',
      width: '200cm',
      priceAdjustment: 100,
      depositAdjustment: 400
    },
    {
      id: 'l-shape',
      name: 'L型沙发',
      width: '280cm',
      priceAdjustment: 200,
      depositAdjustment: 600
    }
  ],
  
  periods: [
    {
      id: 'short',
      name: '3个月',
      months: 3,
      monthlyPrice: 199,
      description: '短期租赁体验'
    },
    {
      id: 'medium',
      name: '6个月',
      months: 6,
      monthlyPrice: 179,
      description: '中期租赁（推荐）'
    },
    {
      id: 'long',
      name: '12个月',
      months: 12,
      monthlyPrice: 159,
      description: '长期租赁更优惠'
    }
  ],
  
  deliveries: [
    {
      id: 'pickup',
      name: '到店自提',
      fee: 0,
      description: '前往门店自提',
      estimatedDays: null
    },
    {
      id: 'standard',
      name: '普通配送',
      fee: 99,
      description: '3-5个工作日送达',
      estimatedDays: '3-5'
    },
    {
      id: 'express',
      name: '急速配送',
      fee: 199,
      description: '次日达（限城市）',
      estimatedDays: '次日'
    }
  ],
  
  reviews: [
    {
      id: 'review-1',
      reviewerName: '张女士',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      rating: 5,
      date: '2024-01-15',
      tags: ['品质优良', '外观时尚'],
      content: '沙发的做工非常精致，面料手感很好，坐上去非常舒适。配送师傅服务态度也很好，整个购买体验非常愉快。强烈推荐给想要提升家居品质的朋友们！',
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=300&q=80'
      ]
    },
    {
      id: 'review-2',
      reviewerName: '李先生',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      rating: 5,
      date: '2024-01-10',
      tags: ['租赁体验好', '性价比高'],
      content: '第一次尝试家具租赁，整体感觉非常棒！租期灵活，押金合理，而且沙发的品质超出预期。下次还会续租或者尝试其他家具。',
      images: [
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&q=80'
      ]
    },
    {
      id: 'review-3',
      reviewerName: '王小姐',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      rating: 4,
      date: '2024-01-05',
      tags: ['服务贴心'],
      content: '客服很专业，回答问题很耐心。沙发收到后和图片一致，没有色差。唯一的建议是希望能增加更多颜色选择。',
      images: []
    }
  ],
  
  servicePromises: [
    {
      icon: 'truck',
      title: '免费配送',
      description: '部分城市免运费'
    },
    {
      icon: 'shield',
      title: '品质保证',
      description: '7天无理由退换'
    },
    {
      icon: 'refresh',
      title: '灵活续租',
      description: '租期可自由续约'
    },
    {
      icon: 'wrench',
      title: '维修服务',
      description: '租期内免费维修'
    }
  ]
}

export const RECOMMENDED_PRODUCT_IMAGES = {
  sofa: [
    {
      id: 'sofa-1',
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      description: '现代灰色沙发'
    },
    {
      id: 'sofa-2',
      url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      description: '浅色布艺沙发'
    },
    {
      id: 'sofa-3',
      url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
      description: '棕色皮质沙发'
    },
    {
      id: 'sofa-4',
      url: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&q=80',
      description: '现代简约沙发'
    }
  ],
  bed: [
    {
      id: 'bed-1',
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      description: '现代双人床'
    },
    {
      id: 'bed-2',
      url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
      description: '实木床架'
    }
  ],
  dining: [
    {
      id: 'table-1',
      url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
      description: '木质餐桌'
    },
    {
      id: 'chair-1',
      url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
      description: '现代餐椅'
    }
  ],
  storage: [
    {
      id: 'shelf-1',
      url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80',
      description: '简约书柜'
    },
    {
      id: 'cabinet-1',
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      description: '储物柜'
    }
  ]
}

export default PRODUCT_SEED_DATA
