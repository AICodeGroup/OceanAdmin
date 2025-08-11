import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string
}

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedViews = ref<TagView[]>([])
  const cachedViews = ref<string[]>([])

  // 添加访问的视图
  const addView = (view: TagView) => {
    addVisitedView(view)
    addCachedView(view)
  }

  // 添加访问的视图
  const addVisitedView = (view: TagView) => {
    if (visitedViews.value.some(v => v.path === view.path)) return
    visitedViews.value.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name'
      })
    )
  }

  // 添加缓存的视图
  const addCachedView = (view: TagView) => {
    if (cachedViews.value.includes(view.name as string)) return
    if (!view.meta?.noCache) {
      cachedViews.value.push(view.name as string)
    }
  }

  // 删除视图
  const delView = (view: TagView) => {
    return new Promise(resolve => {
      delVisitedView(view)
      delCachedView(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  // 删除访问的视图
  const delVisitedView = (view: TagView) => {
    return new Promise(resolve => {
      for (const [i, v] of visitedViews.value.entries()) {
        if (v.path === view.path) {
          visitedViews.value.splice(i, 1)
          break
        }
      }
      resolve([...visitedViews.value])
    })
  }

  // 删除缓存的视图
  const delCachedView = (view: TagView) => {
    return new Promise(resolve => {
      const index = cachedViews.value.indexOf(view.name as string)
      index > -1 && cachedViews.value.splice(index, 1)
      resolve([...cachedViews.value])
    })
  }

  // 删除其他视图
  const delOthersViews = (view: TagView) => {
    return new Promise(resolve => {
      delOthersVisitedViews(view)
      delOthersCachedViews(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  // 删除其他访问的视图
  const delOthersVisitedViews = (view: TagView) => {
    return new Promise(resolve => {
      visitedViews.value = visitedViews.value.filter(v => {
        return v.meta?.affix || v.path === view.path
      })
      resolve([...visitedViews.value])
    })
  }

  // 删除其他缓存的视图
  const delOthersCachedViews = (view: TagView) => {
    return new Promise(resolve => {
      const index = cachedViews.value.indexOf(view.name as string)
      if (index > -1) {
        cachedViews.value = cachedViews.value.slice(index, index + 1)
      } else {
        cachedViews.value = []
      }
      resolve([...cachedViews.value])
    })
  }

  // 删除所有视图
  const delAllViews = () => {
    return new Promise(resolve => {
      delAllVisitedViews()
      delAllCachedViews()
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  // 删除所有访问的视图
  const delAllVisitedViews = () => {
    return new Promise(resolve => {
      const affixTags = visitedViews.value.filter(tag => tag.meta?.affix)
      visitedViews.value = affixTags
      resolve([...visitedViews.value])
    })
  }

  // 删除所有缓存的视图
  const delAllCachedViews = () => {
    return new Promise(resolve => {
      cachedViews.value = []
      resolve([...cachedViews.value])
    })
  }

  // 更新访问的视图
  const updateVisitedView = (view: TagView) => {
    for (let v of visitedViews.value) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }

  return {
    visitedViews,
    cachedViews,
    addView,
    addVisitedView,
    addCachedView,
    delView,
    delVisitedView,
    delCachedView,
    delOthersViews,
    delOthersVisitedViews,
    delOthersCachedViews,
    delAllViews,
    delAllVisitedViews,
    delAllCachedViews,
    updateVisitedView
  }
})