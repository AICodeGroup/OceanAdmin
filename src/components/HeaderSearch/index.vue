<template>
  <div :class="{ show: show }" class="header-search">
    <el-icon class="search-icon" @click.stop="click">
      <Search />
    </el-icon>
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="搜索页面"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="option in options"
        :key="option.item.path"
        :value="option.item"
        :label="option.item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Fuse from 'fuse.js'

const router = useRouter()

const search = ref('')
const options = ref<any[]>([])
const searchPool = ref<any[]>([])
const show = ref(false)
const fuse = ref<Fuse<any>>()
const headerSearchSelect = ref()

const routes = computed(() => router.getRoutes())

const click = () => {
  show.value = !show.value
  if (show.value) {
    headerSearchSelect.value && headerSearchSelect.value.focus()
  }
}

const close = () => {
  headerSearchSelect.value && headerSearchSelect.value.blur()
  options.value = []
  show.value = false
}

const change = (val: any) => {
  router.push(val.path)
  search.value = ''
  options.value = []
  nextTick(() => {
    show.value = false
  })
}

const initFuse = (list: any[]) => {
  fuse.value = new Fuse(list, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: [{
      name: 'title',
      weight: 0.7
    }, {
      name: 'path',
      weight: 0.3
    }]
  })
}

const generateRoutes = (routes: RouteRecordRaw[], basePath = '/', prefixTitle: string[] = []) => {
  let res: any[] = []

  for (const router of routes) {
    if (router.meta?.hidden) { continue }

    const data = {
      path: basePath + router.path,
      title: [...prefixTitle]
    }

    if (router.meta?.title) {
      data.title = [...data.title, router.meta.title]

      if (router.redirect !== 'noRedirect') {
        res.push(data)
      }
    }

    if (router.children) {
      const tempRoutes = generateRoutes(router.children, data.path + '/', data.title)
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes]
      }
    }
  }
  return res
}

const querySearch = (query: string) => {
  if (query !== '') {
    options.value = fuse.value!.search(query)
  } else {
    options.value = []
  }
}

watch(routes, () => {
  searchPool.value = generateRoutes(routes.value)
})

watch(searchPool, (list) => {
  initFuse(list)
})

watch(show, (value) => {
  if (value) {
    document.body.addEventListener('click', close)
  } else {
    document.body.removeEventListener('click', close)
  }
})
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    :deep(.el-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>