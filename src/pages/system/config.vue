<template>
  <div class="app-container">
    <div class="page-header">
      <h1>系统配置</h1>
    </div>

    <el-tabs v-model="activeTab" type="card">
      <!-- 基础配置 -->
      <el-tab-pane label="基础配置" name="basic">
        <div class="card-container">
          <el-form
            ref="basicFormRef"
            :model="basicConfig"
            :rules="basicRules"
            label-width="150px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="系统名称" prop="systemName">
                  <el-input v-model="basicConfig.systemName" placeholder="请输入系统名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系统版本" prop="version">
                  <el-input v-model="basicConfig.version" placeholder="请输入系统版本" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="公司名称" prop="companyName">
                  <el-input v-model="basicConfig.companyName" placeholder="请输入公司名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="basicConfig.phone" placeholder="请输入联系电话" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="系统描述" prop="description">
              <el-input
                v-model="basicConfig.description"
                type="textarea"
                :rows="3"
                placeholder="请输入系统描述"
              />
            </el-form-item>
            
            <el-form-item label="系统Logo" prop="logo">
              <el-input v-model="basicConfig.logo" placeholder="请输入Logo URL" />
            </el-form-item>
            
            <el-form-item label="版权信息" prop="copyright">
              <el-input v-model="basicConfig.copyright" placeholder="请输入版权信息" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSaveBasic">保存配置</el-button>
              <el-button @click="handleResetBasic">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 权限角色管理 -->
      <el-tab-pane label="权限角色" name="roles">
        <div class="button-group">
          <el-button type="primary" @click="handleAddRole">
            <el-icon><Plus /></el-icon>
            新增角色
          </el-button>
        </div>
        
        <div class="card-container">
          <el-table :data="roleList" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="code" label="角色代码" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="userCount" label="用户数量" width="100" />
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleRoleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" @click="handleEditRole(scope.row)">
                  编辑
                </el-button>
                <el-button type="info" size="small" @click="handleRolePermissions(scope.row)">
                  权限
                </el-button>
                <el-button type="danger" size="small" @click="handleDeleteRole(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 菜单配置 -->
      <el-tab-pane label="菜单配置" name="menus">
        <div class="button-group">
          <el-button type="primary" @click="handleAddMenu">
            <el-icon><Plus /></el-icon>
            新增菜单
          </el-button>
          <el-button type="success" @click="handleExpandAll">
            <el-icon><Expand /></el-icon>
            展开全部
          </el-button>
          <el-button type="info" @click="handleCollapseAll">
            <el-icon><Fold /></el-icon>
            收起全部
          </el-button>
        </div>
        
        <div class="card-container">
          <el-table
            ref="menuTableRef"
            :data="menuList"
            style="width: 100%"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column prop="title" label="菜单名称" width="200">
              <template #default="scope">
                <el-icon v-if="scope.row.icon" style="margin-right: 5px">
                  <component :is="scope.row.icon" />
                </el-icon>
                {{ scope.row.title }}
              </template>
            </el-table-column>
            <el-table-column prop="path" label="路径" />
            <el-table-column prop="component" label="组件" />
            <el-table-column prop="sort" label="排序" width="80" />
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleMenuStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" @click="handleEditMenu(scope.row)">
                  编辑
                </el-button>
                <el-button type="success" size="small" @click="handleAddSubMenu(scope.row)">
                  添加子菜单
                </el-button>
                <el-button type="danger" size="small" @click="handleDeleteMenu(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 操作日志 -->
      <el-tab-pane label="操作日志" name="logs">
        <div class="card-container">
          <el-form :model="logSearchForm" :inline="true" class="search-form">
            <el-form-item label="操作用户">
              <el-input v-model="logSearchForm.username" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item label="操作模块">
              <el-select v-model="logSearchForm.module" placeholder="请选择模块" clearable>
                <el-option label="用户管理" value="user" />
                <el-option label="课程管理" value="course" />
                <el-option label="订单管理" value="order" />
                <el-option label="系统配置" value="system" />
              </el-select>
            </el-form-item>
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="logSearchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogSearch">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
              <el-button @click="handleLogReset">
                <el-icon><Refresh /></el-icon>
                重置
              </el-button>
              <el-button type="danger" @click="handleClearLogs">
                <el-icon><Delete /></el-icon>
                清理日志
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="card-container">
          <el-table :data="logList" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="操作用户" width="120" />
            <el-table-column prop="module" label="操作模块" width="120" />
            <el-table-column prop="action" label="操作动作" width="120" />
            <el-table-column prop="description" label="操作描述" />
            <el-table-column prop="ip" label="IP地址" width="140" />
            <el-table-column prop="userAgent" label="用户代理" width="200" show-overflow-tooltip />
            <el-table-column prop="createTime" label="操作时间" width="180" />
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="scope">
                <el-button type="info" size="small" @click="handleViewLog(scope.row)">
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <el-pagination
            v-model:current-page="logPagination.page"
            v-model:page-size="logPagination.size"
            :page-sizes="[10, 20, 50, 100]"
            :total="logPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleLogSizeChange"
            @current-change="handleLogCurrentChange"
          />
        </div>
      </el-tab-pane>

      <!-- 系统信息 -->
      <el-tab-pane label="系统信息" name="info">
        <div class="card-container">
          <el-descriptions title="服务器信息" :column="2" border>
            <el-descriptions-item label="操作系统">{{ systemInfo.os }}</el-descriptions-item>
            <el-descriptions-item label="服务器IP">{{ systemInfo.serverIp }}</el-descriptions-item>
            <el-descriptions-item label="CPU核心数">{{ systemInfo.cpuCores }}</el-descriptions-item>
            <el-descriptions-item label="内存大小">{{ systemInfo.memory }}</el-descriptions-item>
            <el-descriptions-item label="磁盘空间">{{ systemInfo.diskSpace }}</el-descriptions-item>
            <el-descriptions-item label="运行时间">{{ systemInfo.uptime }}</el-descriptions-item>
            <el-descriptions-item label="Java版本">{{ systemInfo.javaVersion }}</el-descriptions-item>
            <el-descriptions-item label="数据库版本">{{ systemInfo.dbVersion }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="card-container">
          <div class="backup-section">
            <h3>系统备份</h3>
            <div class="backup-actions">
              <el-button type="primary" @click="handleBackup">
                <el-icon><Download /></el-icon>
                创建备份
              </el-button>
              <el-button type="success" @click="handleViewBackups">
                <el-icon><FolderOpened /></el-icon>
                查看备份
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 角色编辑对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="roleDialogTitle"
      width="600px"
      @close="resetRoleForm"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色代码" prop="code">
          <el-input v-model="roleForm.code" placeholder="请输入角色代码" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveRole">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限配置"
      width="800px"
    >
      <div v-if="currentRole">
        <h4>为角色 "{{ currentRole.name }}" 配置权限</h4>
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTree"
          :props="{ children: 'children', label: 'name' }"
          show-checkbox
          node-key="id"
          :default-checked-keys="currentRole.permissions || []"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePermissions">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 菜单编辑对话框 -->
    <el-dialog
      v-model="menuDialogVisible"
      :title="menuDialogTitle"
      width="600px"
      @close="resetMenuForm"
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="menuRules"
        label-width="120px"
      >
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="menuForm.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="0" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentId">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuTreeOptions"
            :props="{ children: 'children', label: 'title', value: 'id' }"
            placeholder="请选择父级菜单"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="menuForm.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="menuDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveMenu">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 响应式数据
const activeTab = ref('basic')
const roleDialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const menuDialogVisible = ref(false)
const roleDialogTitle = ref('新增角色')
const menuDialogTitle = ref('新增菜单')
const currentRole = ref<any>(null)

const basicFormRef = ref<FormInstance>()
const roleFormRef = ref<FormInstance>()
const menuFormRef = ref<FormInstance>()
const permissionTreeRef = ref()
const menuTableRef = ref()

// 基础配置
const basicConfig = reactive({
  systemName: '海洋教育后台管理系统',
  version: 'v1.0.0',
  companyName: '海洋教育科技有限公司',
  phone: '400-123-4567',
  description: '专业的海洋教育管理平台，提供课程管理、用户管理、数据统计等功能。',
  logo: '/logo.png',
  copyright: '© 2024 海洋教育科技有限公司 版权所有'
})

// 角色列表
const roleList = ref([
  {
    id: 1,
    name: '超级管理员',
    code: 'super_admin',
    description: '拥有系统所有权限',
    userCount: 2,
    status: 1,
    permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    createTime: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    name: '管理员',
    code: 'admin',
    description: '拥有大部分管理权限',
    userCount: 5,
    status: 1,
    permissions: [1, 2, 3, 4, 5, 6, 7, 8],
    createTime: '2024-01-01 00:00:00'
  },
  {
    id: 3,
    name: '编辑员',
    code: 'editor',
    description: '拥有内容编辑权限',
    userCount: 8,
    status: 1,
    permissions: [1, 2, 3, 4],
    createTime: '2024-01-01 00:00:00'
  }
])

// 菜单列表
const menuList = ref([
  {
    id: 1,
    title: '仪表盘',
    path: '/dashboard',
    component: 'Dashboard',
    icon: 'DataAnalysis',
    sort: 1,
    parentId: null,
    status: 1,
    createTime: '2024-01-01 00:00:00',
    children: []
  },
  {
    id: 2,
    title: '内容管理',
    path: '/content',
    component: 'Layout',
    icon: 'Document',
    sort: 2,
    parentId: null,
    status: 1,
    createTime: '2024-01-01 00:00:00',
    children: [
      {
        id: 21,
        title: '轮播图管理',
        path: '/content/banner',
        component: 'Banner',
        icon: 'Picture',
        sort: 1,
        parentId: 2,
        status: 1,
        createTime: '2024-01-01 00:00:00'
      },
      {
        id: 22,
        title: '课程管理',
        path: '/content/course',
        component: 'Course',
        icon: 'Reading',
        sort: 2,
        parentId: 2,
        status: 1,
        createTime: '2024-01-01 00:00:00'
      }
    ]
  }
])

// 权限树
const permissionTree = ref([
  {
    id: 1,
    name: '仪表盘',
    children: [
      { id: 11, name: '查看仪表盘' }
    ]
  },
  {
    id: 2,
    name: '用户管理',
    children: [
      { id: 21, name: '查看用户' },
      { id: 22, name: '新增用户' },
      { id: 23, name: '编辑用户' },
      { id: 24, name: '删除用户' }
    ]
  },
  {
    id: 3,
    name: '课程管理',
    children: [
      { id: 31, name: '查看课程' },
      { id: 32, name: '新增课程' },
      { id: 33, name: '编辑课程' },
      { id: 34, name: '删除课程' }
    ]
  }
])

// 角色表单
const roleForm = reactive({
  id: null,
  name: '',
  code: '',
  description: '',
  status: 1
})

// 菜单表单
const menuForm = reactive({
  id: null,
  title: '',
  path: '',
  component: '',
  icon: '',
  sort: 0,
  parentId: null,
  status: 1
})

// 日志搜索表单
const logSearchForm = reactive({
  username: '',
  module: '',
  dateRange: []
})

// 日志列表
const logList = ref([
  {
    id: 1,
    username: 'admin',
    module: '用户管理',
    action: '新增',
    description: '新增用户：张三',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createTime: '2024-01-31 10:30:00'
  },
  {
    id: 2,
    username: 'admin',
    module: '课程管理',
    action: '编辑',
    description: '编辑课程：海洋生物探索',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createTime: '2024-01-31 09:15:00'
  }
])

// 系统信息
const systemInfo = reactive({
  os: 'Windows 10 Pro',
  serverIp: '192.168.1.100',
  cpuCores: '8核',
  memory: '16GB',
  diskSpace: '500GB',
  uptime: '15天 8小时 30分钟',
  javaVersion: 'OpenJDK 11.0.2',
  dbVersion: 'MySQL 8.0.25'
})

// 分页数据
const logPagination = reactive({
  page: 1,
  size: 10,
  total: 2
})

// 表单验证规则
const basicRules: FormRules = {
  systemName: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
  version: [{ required: true, message: '请输入系统版本', trigger: 'blur' }],
  companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
}

const roleRules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色代码', trigger: 'blur' }]
}

const menuRules: FormRules = {
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }]
}

// 菜单树选项
const menuTreeOptions = ref([
  { id: null, title: '根目录', children: [] }
])

// 处理保存基础配置
const handleSaveBasic = () => {
  basicFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        ElMessage.success('基础配置保存成功')
      } catch (error) {
        console.error('保存失败:', error)
      }
    }
  })
}

// 处理重置基础配置
const handleResetBasic = () => {
  basicFormRef.value?.resetFields()
}

// 处理新增角色
const handleAddRole = () => {
  roleDialogTitle.value = '新增角色'
  roleDialogVisible.value = true
}

// 处理编辑角色
const handleEditRole = (row: any) => {
  roleDialogTitle.value = '编辑角色'
  Object.assign(roleForm, row)
  roleDialogVisible.value = true
}

// 处理角色权限
const handleRolePermissions = (row: any) => {
  currentRole.value = row
  permissionDialogVisible.value = true
}

// 处理角色状态变更
const handleRoleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? '启用' : '禁用'
  ElMessage.success(`角色${statusText}成功`)
}

// 处理删除角色
const handleDeleteRole = async (row: any) => {
  if (row.userCount > 0) {
    ElMessage.warning('该角色下还有用户，无法删除')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要删除此角色吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = roleList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      roleList.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 处理保存角色
const handleSaveRole = () => {
  roleFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (roleForm.id) {
          ElMessage.success('角色更新成功')
        } else {
          ElMessage.success('角色创建成功')
        }
        roleDialogVisible.value = false
      } catch (error) {
        console.error('保存失败:', error)
      }
    }
  })
}

// 处理保存权限
const handleSavePermissions = () => {
  const checkedKeys = permissionTreeRef.value.getCheckedKeys()
  if (currentRole.value) {
    currentRole.value.permissions = checkedKeys
  }
  ElMessage.success('权限配置保存成功')
  permissionDialogVisible.value = false
}

// 重置角色表单
const resetRoleForm = () => {
  Object.assign(roleForm, {
    id: null,
    name: '',
    code: '',
    description: '',
    status: 1
  })
  roleFormRef.value?.resetFields()
}

// 处理新增菜单
const handleAddMenu = () => {
  menuDialogTitle.value = '新增菜单'
  menuDialogVisible.value = true
}

// 处理编辑菜单
const handleEditMenu = (row: any) => {
  menuDialogTitle.value = '编辑菜单'
  Object.assign(menuForm, row)
  menuDialogVisible.value = true
}

// 处理添加子菜单
const handleAddSubMenu = (row: any) => {
  menuDialogTitle.value = '新增子菜单'
  menuForm.parentId = row.id
  menuDialogVisible.value = true
}

// 处理菜单状态变更
const handleMenuStatusChange = (row: any) => {
  const statusText = row.status === 1 ? '显示' : '隐藏'
  ElMessage.success(`菜单${statusText}成功`)
}

// 处理删除菜单
const handleDeleteMenu = async (row: any) => {
  if (row.children && row.children.length > 0) {
    ElMessage.warning('该菜单下还有子菜单，无法删除')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要删除此菜单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 处理保存菜单
const handleSaveMenu = () => {
  menuFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (menuForm.id) {
          ElMessage.success('菜单更新成功')
        } else {
          ElMessage.success('菜单创建成功')
        }
        menuDialogVisible.value = false
      } catch (error) {
        console.error('保存失败:', error)
      }
    }
  })
}

// 重置菜单表单
const resetMenuForm = () => {
  Object.assign(menuForm, {
    id: null,
    title: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    parentId: null,
    status: 1
  })
  menuFormRef.value?.resetFields()
}

// 处理展开全部
const handleExpandAll = () => {
  // 展开所有节点的逻辑
  ElMessage.info('展开全部功能开发中...')
}

// 处理收起全部
const handleCollapseAll = () => {
  // 收起所有节点的逻辑
  ElMessage.info('收起全部功能开发中...')
}

// 处理日志搜索
const handleLogSearch = () => {
  logPagination.page = 1
  // 搜索日志的逻辑
}

// 处理日志重置
const handleLogReset = () => {
  Object.assign(logSearchForm, {
    username: '',
    module: '',
    dateRange: []
  })
  logPagination.page = 1
}

// 处理清理日志
const handleClearLogs = async () => {
  try {
    await ElMessageBox.confirm('确定要清理所有日志吗？此操作不可恢复！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    ElMessage.success('日志清理成功')
  } catch (error) {
    console.error('清理失败:', error)
  }
}

// 处理查看日志详情
const handleViewLog = (row: any) => {
  ElMessage.info('查看日志详情功能开发中...')
}

// 处理系统备份
const handleBackup = () => {
  ElMessage.success('系统备份已开始，请稍候...')
}

// 处理查看备份
const handleViewBackups = () => {
  ElMessage.info('查看备份功能开发中...')
}

// 日志分页处理
const handleLogSizeChange = (size: number) => {
  logPagination.size = size
}

const handleLogCurrentChange = (page: number) => {
  logPagination.page = page
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.search-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.backup-section {
  h3 {
    margin: 0 0 15px 0;
    color: #303133;
    font-size: 16px;
  }
  
  .backup-actions {
    .el-button {
      margin-right: 10px;
    }
  }
}

:deep(.el-descriptions__title) {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

:deep(.el-tabs__content) {
  padding-top: 20px;
}
</style>
