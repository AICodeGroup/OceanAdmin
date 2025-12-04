<template>
  <div class="app-wrapper" :class="classObj">
    <!-- 侧边栏 -->
    <sidebar class="sidebar-container" />
    
    <!-- 主内容区域 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <navbar />
      
      <!-- 标签页导航 -->
      <tags-view v-if="needTagsView" />
      
      <!-- 页面内容 -->
      <app-main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView/index.vue'
import AppMain from './components/AppMain.vue'

const appStore = useAppStore()

const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  withoutAnimation: appStore.sidebar.withoutAnimation,
  mobile: appStore.device === 'mobile'
}))

const needTagsView = computed(() => appStore.tagsView)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sidebar-width;
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sidebar-width !important;
  background-color: $menuBg;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.08);
}

.hideSidebar {
  .sidebar-container {
    width: $sidebar-collapsed-width !important;
  }
  
  .main-container {
    margin-left: $sidebar-collapsed-width;
  }
}

.withoutAnimation {
  .sidebar-container,
  .main-container {
    transition: none;
  }
}

.mobile {
  .main-container {
    margin-left: 0px;
  }
  
  .sidebar-container {
    transition: transform 0.28s;
    width: $sidebar-width !important;
  }
  
  &.openSidebar {
    position: fixed;
    top: 0;
  }
  
  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sidebar-width, 0, 0);
    }
  }
}
</style>