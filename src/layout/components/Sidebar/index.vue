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
.sidebar-wrapper {
  height: 100%;
  
  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }
  
  .el-scrollbar__bar.is-vertical {
    right: 0px;
  }
  
  .el-scrollbar {
    height: 100%;
  }
  
  &.has-logo {
    .el-scrollbar {
      height: calc(100% - 50px);
    }
  }
  
  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }
}
</style>