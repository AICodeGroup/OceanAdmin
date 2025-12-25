<template>
  <!-- 课程物种关联管理页面主容器 -->
  <div class="app-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h1>课程物种关联管理</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <!-- 课程选择下拉框 -->
        <el-form-item label="课程">
          <el-select v-model="searchForm.courseId" placeholder="请选择课程" clearable filterable @change="loadSpeciesByCourse">
            <el-option
              v-for="course in courseList"
              :key="course.id"
              :label="course.name || course.title"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <!-- 物种选择下拉框 -->
        <el-form-item label="物种">
          <el-select v-model="searchForm.speciesId" placeholder="请选择物种" clearable filterable>
            <el-option
              v-for="species in speciesList"
              :key="species.id"
              :label="species.chineseName"
              :value="species.id"
            />
          </el-select>
        </el-form-item>
        <!-- 搜索和重置按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="button-group">
      <!-- 新增关联按钮 -->
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增关联
      </el-button>
    </div>

    <!-- 关联关系树形表格 -->
    <div class="card-container">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        row-key="_key"
        border
        :indent="20"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <!-- 课程/物种信息列 - 根据节点类型显示不同内容 -->
        <el-table-column label="课程/物种信息" min-width="350">
          <template #default="{ row }">
            <!-- 课程节点显示 -->
            <span class="tree-node-content" v-if="!row.isSpecies">
              <el-image
                v-if="row.courseCover"
                :src="row.courseCover"
                class="node-image course-cover"
                fit="cover"
              />
              <div class="node-detail">
                <div class="node-title">{{ row.courseTitle }}</div>
                <div class="node-meta" v-if="row.courseLevel">
                  <span class="meta-text">{{ row.courseLevel }}</span>
                </div>
              </div>
              <el-tag size="small" type="success" class="node-type-tag">课程</el-tag>
            </span>
            <!-- 物种子节点显示 -->
            <span class="tree-node-content species-node" v-else>
              <el-image
                v-if="row.speciesImage"
                :src="row.speciesImage"
                class="node-image species-image"
                fit="cover"
              />
              <el-icon v-else class="species-icon"><Postcard /></el-icon>
              <div class="node-detail">
                <div class="node-title">{{ row.speciesChineseName }}</div>
                <div class="node-meta">
                  <span class="scientific-name">{{ row.speciesScientificName }}</span>
                </div>
              </div>
              <el-tag size="small" type="info" class="node-type-tag">物种</el-tag>
            </span>
          </template>
        </el-table-column>
        <!-- ID列 -->
        <el-table-column prop="id" label="ID" width="100" align="center" />
        <!-- 操作列 -->
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)" v-if="row.isSpecies">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加/编辑关联对话框 -->
    <el-dialog
      v-model="formVisible"
      :title="formTitle"
      width="800px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <!-- 课程选择行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择课程" prop="courseId">
              <el-select v-model="form.courseId" placeholder="请选择课程" filterable style="width: 100%">
                <el-option
                  v-for="course in courseList"
                  :key="course.id"
                  :label="course.name || course.title"
                  :value="course.id"
                >
                  <!-- 课程选项显示内容 -->
                  <div class="course-option">
                    <span>{{ course.name || course.title }}</span>
                    <el-tag size="small" type="info">{{ course.category }}</el-tag>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
        </el-row>
        
        <!-- 物种选择行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择物种" prop="speciesIds">
              <!-- 多选物种下拉框 -->
              <el-select 
                v-model="form.speciesIds" 
                placeholder="请选择物种（可多选）" 
                filterable 
                multiple 
                collapse-tags 
                collapse-tags-tooltip
                style="width: 100%"
              >
                <el-option
                  v-for="species in speciesList"
                  :key="species.id"
                  :label="species.chineseName"
                  :value="species.id"
                >
                  <!-- 物种选项显示内容 -->
                  <div class="species-option">
                    <span>{{ species.chineseName }}</span>
                    <small>{{ species.scientificName }}</small>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

  
    
  </div>
</template>

<script setup lang="ts">
// Vue 3 Composition API 相关导入
import { ref, reactive, onMounted } from 'vue'
// Element Plus 消息提示和确认框
import { ElMessage, ElMessageBox } from 'element-plus'
// Element Plus 表单类型定义
import type { FormInstance, FormRules } from 'element-plus'
// HTTP 请求工具
import request from '@/utils/request'

// ========== 响应式数据定义 ==========
// 页面加载状态
const loading = ref(false)
// 表格引用
const tableRef = ref()
// 表单对话框显示状态
const formVisible = ref(false)
// 表单对话框标题
const formTitle = ref('新增关联')
// 表单引用
const formRef = ref<FormInstance>()

// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  name: '',
  isAbroad: null,
  isOcean: null,
  isShow: null,
});

// ========== 数据列表定义 ==========
// 表格数据（课程为父节点，物种为子节点）
const tableData = ref<any[]>([])

// 课程列表（从后端获取）
const courseList = ref<any[]>([])

// 物种下拉数据（随选中课程变化）
const speciesList = ref<any[]>([])

// 分类列表（如需后端获取，可后续接入）
const categoryList = ref<any[]>([])

// ========== 表单数据定义 ==========
// 搜索表单数据
const searchForm = reactive({
  courseId: '',
  speciesId: '',
  categoryId: '',
  relationType: '',
  status: ''
})

// 关联表单数据
const form = reactive({
  id: null,
  courseId: '',
  speciesIds: [],
  relationType: '',
  weight: 5,
  description: '',
  status: 1
})

// 表单验证规则
const rules: FormRules = {
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  speciesIds: [{ required: true, type: 'array', min: 1, message: '请选择至少一个物种', trigger: 'change' }],
  relationType: [{ required: true, message: '请选择关联类型', trigger: 'change' }],
  weight: [{ required: true, message: '请设置权重', trigger: 'blur' }]
}

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// ========== API 调用函数 ==========
/**
 * 获取课程信息列表
 */
const getCList = async () => {
  loading.value = true;
  try {
    const response = await request({
      url: '/admin/platform/product/course/list',
      method: 'get',
      params: queryParams,
    });
    
    // 根据实际API响应结构，数据直接在response下
    if (response && (response as any).list) {
        courseList.value = (response as any).list;
        console.log('成功加载课程数据:', courseList.value.length, '条课程');
    } else {
        console.warn('API响应格式异常:', response);
        courseList.value = [];
    }
  } catch (error) {
    console.error('获取课程列表失败:', error);
    ElMessage.error('获取课程列表失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 获取关联列表数据（课程-物种树形结构）
 */
const getList = async () => {
  loading.value = true
  try {
    // 拉取课程分页数据
    const courseRes: any = await request({
      url: '/admin/platform/product/course/list',
      method: 'get',
      params: queryParams
    })
    const courseRows: any[] = (courseRes && (courseRes.list || courseRes.data || courseRes.records)) || []

    // 并发获取每个课程的物种列表
    const speciesPromises = courseRows.map((c: any) => request({
      url: `/admin/platform/product-species/list/${c.id}`,
      method: 'get'
    }).catch(() => ({ list: [] })))
    const speciesResults: any[] = await Promise.all(speciesPromises)

    // 组装成树形结构：课程为父节点，物种为子节点
    tableData.value = courseRows.map((c: any, index: number) => {
      const row = {
        id: c.id,
        _key: `c-${c.id}`,
        isSpecies: false,
        courseId: c.id,
        courseTitle: c.title ?? c.name ?? '',
        courseLevel: c.level ?? '',
        courseCover: c.cover ?? '',
        isDel: '-',
        weight: '',
        description: c.description ?? '',
        status: 1,
        createTime: c.createTime ?? '',
        children: [] as any[]
      }
      const rawList: any[] = (speciesResults[index] && (speciesResults[index].data || speciesResults[index].list || speciesResults[index].records || speciesResults[index])) || []
      row.children = rawList.map((s: any) => ({
        id: s.id ?? s.speciesId ?? s.sid,
        _key: `s-${c.id}-${s.speciesId ?? s.id ?? s.sid}`,
        isSpecies: true,
        courseId: c.id,
        speciesId: s.speciesId ?? s.species?.id ?? s.id,
        speciesChineseName: s.species?.name ?? '-',
        speciesScientificName: s.species?.latinName ?? s.species?.englishName ?? '-',
        isDel: s.species?.isDel ? '是' : '否',
        speciesImage: s.species?.imageUrl ?? s.species?.iconUrl ?? '',
        relationType: 'related',
        weight: 0,
        description: s.species?.description ?? '',
        status: 1,
        createTime: s.createdAt ?? s.createTime ?? ''
      }))
      return row
    })
    pagination.total = tableData.value.length
  } catch (error) {
    console.error('获取关联列表失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 加载物种下拉选项（全部物种，用于新增关联选择）
 */
const loadAllSpeciesOptions = async () => {
  try {
    const res: any = await request({
      url: '/admin/platform/species/list',
      method: 'get',
      params: { page: 1, limit: 1000 }
    })
    const rows: any[] = (res && (res.list || res.data || res.records)) || []
    speciesList.value = rows.map((s: any) => ({
      id: s.id,
      chineseName: s.chineseName ?? s.name ?? '-',
      scientificName: s.scientificName ?? s.latinName ?? '-',
      category: s.name ?? s.category ?? '-'
    }))
  } catch (e) {
    console.error('加载物种下拉失败:', e)
  }
}

// ========== 搜索和过滤功能 ==========
/**
 * 处理搜索操作
 */
const handleSearch = () => {
  pagination.page = 1
  getList()
}

/**
 * 处理重置搜索条件
 */
const handleReset = () => {
  Object.assign(searchForm, {
    courseId: '',
    speciesId: '',
    categoryId: '',
    relationType: '',
    status: ''
  })
  pagination.page = 1
  getList()
}

/**
 * 监听课程选择，自动加载该课程的物种下拉与表格
 * @param courseId 课程ID
 */
const loadSpeciesByCourse = async (courseId: number | string) => {
  if (!courseId) {
    speciesList.value = []
    return
  }
  try {
    const res: any = await request({
      url: `/admin/platform/product-species/list/${Number(courseId)}`,
      method: 'get'
    })
    const raw: any[] = (res && (res.list || res.data || res.records || res)) || []
    speciesList.value = raw.map((s: any) => ({
      id: s.id ?? s.speciesId ?? s.sid,
      chineseName: s.chineseName ?? s.name ?? s.commonName ?? '-',
      scientificName: s.scientificName ?? s.latinName ?? s.sciName ?? '-',
      category: s.category ?? s.name ?? s.typeName ?? '-'
    }))
  } catch (e) {
    console.error('加载课程物种失败:', e)
  }
}

// ========== 表单操作功能 ==========
/**
 * 处理新增关联
 */
const handleAdd = () => {
  formTitle.value = '新增关联'
  // 确保下拉有数据
  getCList()
  loadAllSpeciesOptions()
  formVisible.value = true
}

/**
 * 处理编辑关联
 * @param row 要编辑的行数据
 */
const handleEdit = (row: any) => {
  formTitle.value = '编辑关联'
  // 如果是物种子节点，则将该课程下已关联的所有物种预选，便于增删
  const courseId = row.isSpecies ? row.courseId : row.id
  const courseNode = tableData.value.find((c: any) => c.id === courseId)
  const selectedIds = Array.isArray(courseNode?.children)
    ? courseNode!.children.map((s: any) => s.speciesId)
    : []
  Object.assign(form, {
    id: null,
    courseId: courseId,
    speciesIds: selectedIds,
    relationType: row.relationType || '',
    weight: row.weight || 5,
    description: row.description || '',
    status: row.status ?? 1
  })
  // 确保物种下拉有数据
  loadAllSpeciesOptions()
  formVisible.value = true
}

/**
 * 处理删除关联
 * @param row 要删除的行数据
 */
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除此关联吗？删除后无法恢复！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 若为子节点（物种），调用单个取消关联接口
    if (row.isSpecies) {
      await request({
        url: 'admin/platform/product-species/disassociate',
        method: 'delete',
        params: { productId: row.courseId, speciesId: row.speciesId }
      })
      ElMessage.success('已移除该物种关联')
      await getList()
    } else {
      // 父课程节点暂不支持在此删除
      ElMessage.info('请在课程管理处删除课程，或移除其下物种关联')
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

/**
 * 处理表单提交
 */
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          ElMessage.success('更新成功')
        } else {
          // 多选关联：按课程ID与多个物种ID提交
          await request({
            url: 'admin/platform/product-species/associate',
            method: 'post',
            data: {
              productId: form.courseId,
              speciesIds: form.speciesIds
            }
          })
          ElMessage.success('关联成功')
        }
        formVisible.value = false
        getList()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

/**
 * 重置表单数据
 */
const resetForm = () => {
  Object.assign(form, {
    id: null,
    courseId: '',
    speciesIds: [],
    relationType: '',
    weight: 5,
    description: '',
    status: 1
  })
  formRef.value?.resetFields()
}

// ========== 分页处理 ==========
/**
 * 处理每页条数变化
 * @param size 每页条数
 */
const handleSizeChange = (size: number) => {
  pagination.size = size
  getList()
}

/**
 * 处理当前页变化
 * @param page 当前页码
 */
const handleCurrentChange = (page: number) => {
  pagination.page = page
  getList()
}

// ========== 生命周期钩子 ==========
onMounted(() => {
  getList()
  // 首次进入即加载可选项
  getCList()
  loadAllSpeciesOptions()
})
</script>

<style lang="scss" scoped>
.stats-container {
  margin-bottom: 20px;
  
  .stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-size: 24px;
      color: white;
      
      &.total {
        background: #409eff;
      }
      
      &.courses {
        background: #67c23a;
      }
      
      &.species {
        background: #e6a23c;
      }
      
      &.active {
        background: #f56c6c;
      }
    }
    
    .stat-content {
      .stat-number {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
        line-height: 1;
      }
      
      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-top: 5px;
      }
    }
  }
}

.search-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

// 树形节点内容样式
.tree-node-content {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  
  .node-image {
    flex-shrink: 0;
    border-radius: 4px;
    
    &.course-cover {
      width: 40px;
      height: 40px;
    }
    
    &.species-image {
      width: 28px;
      height: 28px;
    }
  }
  
  .species-icon {
    font-size: 20px;
    color: #67c23a;
    flex-shrink: 0;
  }
  
  .node-detail {
    display: flex;
    flex-direction: column;
    gap: 2px;
    
    .node-title {
      font-weight: 500;
      color: #303133;
      white-space: nowrap;
    }
    
    .node-meta {
      .meta-text {
        font-size: 12px;
        color: #909399;
      }
      
      .scientific-name {
        font-size: 12px;
        font-style: italic;
        color: #606266;
      }
    }
  }
  
  .node-type-tag {
    flex-shrink: 0;
    margin-left: 8px;
  }
}

// 表格样式增强
:deep(.el-table) {
  .el-table__row {
    &:hover > td {
      background-color: #f5f7fa;
    }
  }
  
  .el-table__expand-icon {
    color: #409eff;
    font-size: 14px;
    margin-right: 6px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    flex-shrink: 0;
    
    &:hover {
      color: #337ecc;
    }
    
    &.el-table__expand-icon--expanded {
      transform: rotate(90deg);
    }
  }
  
  .el-table__placeholder {
    display: inline-block;
    width: 20px;
    flex-shrink: 0;
  }
  
  td:first-child .cell {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
  
  .el-table__indent {
    flex-shrink: 0;
  }
}

.course-option, .species-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  small {
    color: #909399;
    font-style: italic;
  }
}

.batch-relation {
  .el-transfer {
    margin: 20px 0;
  }
}

.description-text {
  line-height: 1.6;
  color: #606266;
}
</style>