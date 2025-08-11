import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebar = ref({
    opened: true,
    withoutAnimation: false
  })
  
  const device = ref('desktop')
  const tagsView = ref(true)
  const fixedHeader = ref(false)
  const sidebarLogo = ref(true)

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
  }

  // 关闭侧边栏
  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  // 切换设备类型
  const toggleDevice = (deviceType: string) => {
    device.value = deviceType
  }

  // 设置标签页显示
  const setTagsView = (show: boolean) => {
    tagsView.value = show
  }

  // 设置固定头部
  const setFixedHeader = (fixed: boolean) => {
    fixedHeader.value = fixed
  }

  // 设置侧边栏Logo
  const setSidebarLogo = (show: boolean) => {
    sidebarLogo.value = show
  }

  return {
    sidebar,
    device,
    tagsView,
    fixedHeader,
    sidebarLogo,
    toggleSidebar,
    closeSidebar,
    toggleDevice,
    setTagsView,
    setFixedHeader,
    setSidebarLogo
  }
})