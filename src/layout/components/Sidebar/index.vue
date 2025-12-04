<template>
  <div class="sidebar-wrapper">
    <!-- Logo -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    
    <!-- 菜单 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.scss'

const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()

const routes = computed(() => authStore.routes)
const showLogo = computed(() => appStore.sidebarLogo)
const isCollapse = computed(() => !appStore.sidebar.opened)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.sidebar-wrapper {
  height: 100%;
  background: $menuBg;
  
  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }
  
  .el-scrollbar__bar.is-vertical {
    right: 0px;
  }
  
  .el-scrollbar {
    height: calc(100% - 64px);
  }
  
  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
    background: transparent;
  }
  
  // 自定义滚动条样式 - 若依风格
  :deep(.el-scrollbar__thumb) {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  // 菜单项间距优化 - 若依风格
  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 50px;
    line-height: 50px;
    margin: 0;
    padding: 0 20px !important;
    border-radius: 0;
    font-size: 14px;
    transition: all 0.3s;
    color: $menuText !important;
    background-color: transparent !important;
    
    &:hover {
      background-color: $menuHover !important;
      color: $menuText !important;
    }
    
    .el-icon {
      font-size: 18px;
      margin-right: 10px;
      vertical-align: middle;
      color: $menuText !important;
      transition: all 0.3s;
    }
    
    span {
      color: $menuText !important;
    }
  }
  
  // 一级菜单项激活状态
  :deep(.el-menu-item.is-active) {
    background-color: $menuActiveBg !important;
    color: $menuActiveText !important;
    
    .el-icon {
      color: $menuActiveText !important;
    }
    
    span {
      color: $menuActiveText !important;
    }
  }
  
  // 子菜单样式 - 深色背景
  :deep(.el-sub-menu) {
    .el-menu {
      background-color: $subMenuBg !important;
    }
  }
  
  // 子菜单项样式
  :deep(.nest-menu .el-menu-item) {
    min-width: auto;
    padding-left: 50px !important;
    height: 48px;
    line-height: 48px;
    background-color: transparent;
    
    &:hover {
      background-color: $menuHover !important;
    }
    
    // 子菜单激活状态
    &.is-active {
      background-color: $subMenuHover !important;
      color: $menuActiveText !important;
      
      .el-icon {
        color: $menuActiveText !important;
      }
      
      span {
        color: $menuActiveText !important;
      }
    }
  }
  
  // 子菜单箭头
  :deep(.el-sub-menu__icon-arrow) {
    color: $menuText;
    font-weight: bold;
    transition: transform 0.3s;
    right: 20px;
  }
  
  // 子菜单展开状态
  :deep(.el-sub-menu.is-opened) {
    > .el-sub-menu__title {
      background-color: $menuActiveBg !important;
      color: $menuActiveText !important;
      
      .el-icon {
        color: $menuActiveText !important;
      }
      
      span {
        color: $menuActiveText !important;
      }
      
      .el-sub-menu__icon-arrow {
        transform: rotateZ(180deg);
        color: $menuActiveText !important;
      }
    }
  }
  
  // 折叠状态下的样式
  :deep(.el-menu--collapse) {
    .el-menu-item,
    .el-sub-menu__title {
      padding: 0 20px !important;
      text-align: center;
      
      .el-icon {
        margin-right: 0;
      }
      
      span {
        display: none;
      }
    }
    
    .el-sub-menu__icon-arrow {
      display: none;
    }
  }
}
</style>