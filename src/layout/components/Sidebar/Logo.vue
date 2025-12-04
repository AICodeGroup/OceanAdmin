<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  collapse: boolean
}

defineProps<Props>()

const title = '海洋教育管理系统'
const logo = '/logo.svg' // 使用 SVG logo
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.sidebarLogoFade-enter-active {
  transition: opacity 0.3s;
}

.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 64px;
  line-height: 64px;
  background: $menuBg;
  text-align: center;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    &:hover {
      background-color: $menuHover;
      
      .sidebar-logo {
        transform: scale(1.05);
      }
      
      .sidebar-title {
        color: $menuActiveText;
      }
    }

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      flex-shrink: 0;
    }

    & .sidebar-title {
      margin: 0;
      color: $menuActiveText;
      font-weight: 600;
      font-size: 18px;
      font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      letter-spacing: 1px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      text-align: left;
    }
  }

  &.collapse {
    .sidebar-logo-link {
      padding: 0;
      justify-content: center;
    }
    
    .sidebar-logo {
      margin-right: 0;
    }
    
    .sidebar-title {
      display: none;
    }
  }
}
</style>