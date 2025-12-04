<template>
  <div v-if="!item.meta?.hidden">
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.meta?.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <el-icon v-if="onlyOneChild.meta.icon">
            <component :is="onlyOneChild.meta.icon" />
          </el-icon>
          <template #title>
            <span>{{ onlyOneChild.meta.title }}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" teleported>
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { isExternal } from '@/utils/validate'
import AppLink from './Link.vue'

// 扩展RouteRecordRaw类型以支持noShowingChildren
type ExtendedRouteRecord = RouteRecordRaw & {
  noShowingChildren?: boolean
}

interface Props {
  item: RouteRecordRaw
  isNest?: boolean
  basePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  isNest: false,
  basePath: ''
})

const onlyOneChild = ref<ExtendedRouteRecord>({} as ExtendedRouteRecord)

const hasOneShowingChild = (children: RouteRecordRaw[] = [], parent: RouteRecordRaw) => {
  const showingChildren = children.filter(item => {
    if (item.meta?.hidden) {
      return false
    } else {
      onlyOneChild.value = item
      return true
    }
  })

  if (showingChildren.length === 1) {
    return true
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return props.basePath ? `${props.basePath}/${routePath}`.replace(/\/+/g, '/') : routePath
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

// 菜单项基础样式
.el-menu-item,
.nest-menu .el-sub-menu > .el-sub-menu__title {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  position: relative;
  
  &:hover {
    background-color: $menuHover !important;
    
    :deep(.el-icon) {
      color: $menuActiveText;
    }
  }
}

// 子菜单标题样式
:deep(.el-sub-menu__title) {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  
  &:hover {
    background-color: $menuHover !important;
    
    .el-icon {
      color: $menuActiveText;
    }
  }
}

// 子菜单展开时的效果
:deep(.el-sub-menu.is-opened) {
  > .el-sub-menu__title {
    background-color: rgba(0, 0, 0, 0.1);
    
    .el-icon {
      color: $menuActiveText;
    }
  }
}

// 图标样式
:deep(.el-icon) {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  vertical-align: middle;
}

// 菜单文字
:deep(span) {
  vertical-align: middle;
  font-size: 14px;
}
</style>