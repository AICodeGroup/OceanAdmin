<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-image">
        <img src="/404.svg" alt="404" />
      </div>
      <div class="error-content">
        <h1 class="error-title">404</h1>
        <h2 class="error-subtitle">页面未找到</h2>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被删除。
        </p>
        <div class="error-actions">
          <el-button type="primary" @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
          <el-button @click="goBack">
            <el-icon><Back /></el-icon>
            返回上页
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.error-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-container {
  display: flex;
  align-items: center;
  max-width: 800px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.error-image {
  flex: 1;
  text-align: center;
  margin-right: 40px;
  
  img {
    max-width: 300px;
    height: auto;
  }
}

.error-content {
  flex: 1;
  
  .error-title {
    font-size: 72px;
    font-weight: bold;
    color: #409eff;
    margin: 0;
    line-height: 1;
  }
  
  .error-subtitle {
    font-size: 24px;
    color: #303133;
    margin: 10px 0;
  }
  
  .error-description {
    font-size: 16px;
    color: #606266;
    margin: 20px 0 30px;
    line-height: 1.6;
  }
  
  .error-actions {
    .el-button {
      margin-right: 15px;
    }
  }
}

@media (max-width: 768px) {
  .error-container {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  
  .error-image {
    margin-right: 0;
    margin-bottom: 20px;
    
    img {
      max-width: 200px;
    }
  }
  
  .error-content {
    .error-title {
      font-size: 48px;
    }
    
    .error-subtitle {
      font-size: 20px;
    }
  }
}
</style>