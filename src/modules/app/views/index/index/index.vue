<template>
  <div class="home-guide">
    <!-- 顶部搜索栏 -->
    <div class="search">
      <van-search
        shape="round"
        background="transparent"
        placeholder="请输入搜索关键词"
      >
        <template #label> 筛选 </template>
        <template #action> action </template>
        <template #right-icon>
          <van-button
            class="search-button"
            round
            icon="search"
            color=" linear-gradient(to right, #FF4B2B, #FF416C)"
          >
            搜索
          </van-button>
        </template>
      </van-search>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <div class="welcome-title">
          <h1>欢迎来到1s</h1>
          <p>AI驱动的3D设计平台</p>
        </div>
        
        <!-- 功能特色卡片 -->
        <div class="features-grid">
          <div class="feature-card" @click="goToDesign">
            <div class="feature-icon">
              <van-icon name="star" size="24" color="#FF6B35" />
            </div>
            <div class="feature-content">
              <h3>开始设计</h3>
              <p>使用AI助手创建独特的3D设计</p>
            </div>
            <van-icon name="arrow" size="16" color="#999" />
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <van-icon name="photo" size="24" color="#4CAF50" />
            </div>
            <div class="feature-content">
              <h3>素材库</h3>
              <p>丰富的贴纸、字体、模型资源</p>
            </div>
            <van-icon name="arrow" size="16" color="#999" />
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <van-icon name="friends" size="24" color="#2196F3" />
            </div>
            <div class="feature-content">
              <h3>社区分享</h3>
              <p>与设计师交流，分享作品</p>
            </div>
            <van-icon name="arrow" size="16" color="#999" />
          </div>
        </div>
      </div>

      <!-- 快速开始区域 -->
      <div class="quick-start-section">
        <div class="section-title">
          <h2>快速开始</h2>
          <p>选择您想要的设计类型</p>
        </div>

        <div class="design-types">
          <div class="design-type-card" @click="goToDesign">
            <div class="type-icon">
              <van-icon name="gem" size="32" color="#FFD700" />
            </div>
            <h3>3D设计</h3>
            <p>创建精美的3D模型和场景</p>
          </div>

          <div class="design-type-card" @click="goToDesign">
            <div class="type-icon">
              <van-icon name="photo" size="32" color="#FF6B35" />
            </div>
            <h3>平面设计</h3>
            <p>制作海报、名片、宣传图</p>
          </div>

          <div class="design-type-card" @click="goToDesign">
            <div class="type-icon">
              <van-icon name="smile" size="32" color="#4CAF50" />
            </div>
            <h3>贴纸设计</h3>
            <p>制作个性化贴纸和表情</p>
          </div>
        </div>
      </div>

      <!-- 最近作品展示 -->
      <div class="recent-works-section" v-if="recentWorks.length > 0">
        <div class="section-title">
          <h2>最近作品</h2>
          <van-button type="primary" size="small" @click="goToDesign">查看更多</van-button>
        </div>

        <div class="works-grid">
          <div 
            v-for="work in recentWorks" 
            :key="work.id" 
            class="work-card"
            @click="goToDesign"
          >
            <img :src="work.thumbnail" :alt="work.title" />
            <div class="work-info">
              <h4>{{ work.title }}</h4>
              <p>{{ work.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部引导 -->
      <div class="bottom-guide">
        <van-button 
          type="primary" 
          size="large" 
          block 
          @click="goToDesign"
          class="start-design-btn"
        >
          <van-icon name="play" size="18" />
          开始设计
        </van-button>
        
        <p class="guide-tip">
          点击上方按钮进入设计页面，开始您的创作之旅
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟最近作品数据
const recentWorks = ref([
  {
    id: 1,
    title: '夏日海报',
    description: '清新夏日主题设计',
    thumbnail: 'https://via.placeholder.com/120x120/FF6B35/FFFFFF?text=海报'
  },
  {
    id: 2,
    title: '3D模型',
    description: '精美的3D建筑模型',
    thumbnail: 'https://via.placeholder.com/120x120/4CAF50/FFFFFF?text=3D'
  },
  {
    id: 3,
    title: '贴纸设计',
    description: '可爱卡通贴纸',
    thumbnail: 'https://via.placeholder.com/120x120/2196F3/FFFFFF?text=贴纸'
  }
])

// 跳转到设计页面
const goToDesign = () => {
  router.push('/design')
}
</script>

<style lang="less" scoped>
@search-button-padding: 2px;

:root:root {
  --van-search-input-height: 36px;
}

.home-guide {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.search {
  overflow: hidden;
  padding: 16px;
  
  .search-button {
    height: 32px;
    margin: @search-button-padding;
  }

  .van-field__right-icon {
    padding: 0;
  }
}

.main-content {
  padding: 0 16px 32px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  
  .welcome-title {
    margin-bottom: 32px;
    
    h1 {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 8px;
      background: linear-gradient(45deg, #FFD700, #FFA500);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    p {
      font-size: 16px;
      opacity: 0.9;
    }
  }
}

.features-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}

.feature-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.15);
  }
  
  .feature-icon {
    margin-right: 16px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }
  
  .feature-content {
    flex: 1;
    
    h3 {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    p {
      font-size: 14px;
      opacity: 0.8;
      margin: 0;
    }
  }
}

.quick-start-section {
  margin-bottom: 40px;
  
  .section-title {
    text-align: center;
    margin-bottom: 24px;
    
    h2 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 14px;
      opacity: 0.8;
    }
  }
}

.design-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.design-type-card {
  text-align: center;
  padding: 24px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.15);
  }
  
  .type-icon {
    margin-bottom: 12px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: inline-block;
  }
  
  h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 12px;
    opacity: 0.8;
    margin: 0;
  }
}

.recent-works-section {
  margin-bottom: 40px;
  
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h2 {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
    }
  }
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.work-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 80px;
    object-fit: cover;
  }
  
  .work-info {
    padding: 8px;
    
    h4 {
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 4px;
      margin: 0 0 4px 0;
    }
    
    p {
      font-size: 10px;
      opacity: 0.8;
      margin: 0;
      line-height: 1.2;
    }
  }
}

.bottom-guide {
  text-align: center;
  
  .start-design-btn {
    margin-bottom: 16px;
    height: 48px;
    font-size: 16px;
    font-weight: bold;
    background: linear-gradient(45deg, #FF6B35, #FF416C);
    border: none;
    border-radius: 24px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
    }
  }
  
  .guide-tip {
    font-size: 12px;
    opacity: 0.8;
    margin: 0;
  }
}
</style>
