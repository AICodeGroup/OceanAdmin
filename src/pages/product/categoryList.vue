<template>
    <div class="category-management-page">
        <!-- 页面标题 -->
        <div class="page-header">
            <div class="header-left">
                <el-icon class="header-icon" :size="28">
                    <Menu />
                </el-icon>
                <h1 class="page-title">商品分类管理</h1>
            </div>
            <div class="header-actions">
                <el-button type="primary" size="large" @click="handleAdd" round>
                    <el-icon class="btn-icon">
                        <Plus />
                    </el-icon>
                    新增分类
                </el-button>
                <el-button size="large" @click="handleRefresh" round>
                    <el-icon class="btn-icon">
                        <Refresh />
                    </el-icon>
                    刷新
                </el-button>
            </div>
        </div>

        <!-- 分类树表格 -->
        <el-card shadow="never" class="table-card">
            <el-table
                :data="categoryList"
                row-key="id"
                border
                stripe
                style="width: 100%"
                v-loading="loading"
            >
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="name" label="分类名称" min-width="200">
                    <template #default="{ row }">
                        <div class="category-name">
                            <img v-if="row.icon" :src="row.icon" style="width: 24px; height: 24px; margin-right: 8px; object-fit: cover; border-radius: 4px;" />
                            <span>{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="icon" label="图标" width="150">
                    <template #default="{ row }">
                        <div v-if="row.icon" style="display: flex; align-items: center; gap: 8px;">
                            <img :src="row.icon" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid #e4e7ed;" />
                        </div>
                        <span v-else style="color: #909399;">-</span>
                    </template>
                </el-table-column>

                <el-table-column prop="sort" label="排序" width="100" sortable />
                <el-table-column prop="isShow" label="显示状态" width="120">
                    <template #default="{ row }">
                        <el-switch
                            v-model="row.isShow"
                            @change="handleToggleShow(row)"
                            :disabled="updating"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                    <template #default="{ row }">
                        <div class="action-buttons">
                            <el-button size="small" text type="warning" @click="handleEdit(row)">
                                <el-icon><Edit /></el-icon>
                                编辑
                            </el-button>
                            <el-button size="small" text type="danger" @click="handleDelete(row)">
                                <el-icon><Delete /></el-icon>
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑分类弹窗 -->
        <el-dialog
            v-model="dialogVisible"
            :title="form.id ? '编辑分类' : '新增分类'"
            width="600px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="formRef"
                :model="form"
                :rules="formRules"
                label-width="100px"
            >
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入分类名称" maxlength="100" show-word-limit />
                </el-form-item>

                <el-form-item label="分类图标">
                    <ImageUpload v-model="form.icon" model="product" :pid="1" placeholder="上传图标" />
                </el-form-item>

                <el-form-item label="排序">
                    <el-input-number v-model="form.sort" :min="0" :step="1" style="width: 100%" />
                    <div class="form-tip">数值越大越靠前</div>
                </el-form-item>

                <el-form-item label="是否显示">
                    <el-switch v-model="form.isShow" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 图标引入
import { Menu, Plus, Refresh, Edit, Delete } from '@element-plus/icons-vue';

// 组件引入
import ImageUpload from '@/components/ImageUpload/index.vue';

// API导入
import {
    getMerchantCategoryList,
    createMerchantCategory,
    updateMerchantCategory,
    deleteMerchantCategory,
    toggleMerchantCategoryShow,
    ProductCategory
} from '@/api/product';

// 响应式数据
const loading = ref(false);
const updating = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const formRef = ref();
const categoryList = ref<ProductCategory[]>([]);

// 表单数据
const form = reactive({
    id: undefined as number | undefined,
    pid: 0,
    name: '',
    icon: '',
    level: 1,  // 默认一级分类
    sort: 100,
    isShow: true
});

// 表单验证规则
const formRules = {
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
};



// 生命周期
onMounted(() => {
    loadCategoryList();
});

// 加载分类列表
const loadCategoryList = async () => {
    loading.value = true;
    try {
        // request拦截器已经提取了data字段，所以response就是数组本身
        const response = await getMerchantCategoryList() as unknown as ProductCategory[];
        categoryList.value = response || [];
    } catch (error) {
        console.error('加载分类列表失败:', error);
        ElMessage.error('加载分类列表失败');
    } finally {
        loading.value = false;
    }
};

// 刷新
const handleRefresh = () => {
    loadCategoryList();
};

// 新增分类
const handleAdd = () => {
    Object.assign(form, {
        id: undefined,
        pid: 0,
        name: '',
        icon: '',
        level: 1,  // 顶级分类
        sort: 100,
        isShow: true
    });
    dialogVisible.value = true;
};



// 编辑分类
const handleEdit = (row: ProductCategory) => {
    Object.assign(form, {
        id: row.id,
        pid: 0,  // 一级分类默认pid为0
        name: row.name,
        icon: row.icon,
        level: 1,  // 一级分类
        sort: row.sort,
        isShow: row.isShow
    });
    dialogVisible.value = true;
};

// 保存分类
const handleSave = async () => {
    if (!formRef.value) return;
    
    try {
        await formRef.value.validate();
        saving.value = true;
        
        if (form.id) {
            // 编辑
            const data = {
                id: form.id,
                pid: form.pid,
                name: form.name,
                icon: form.icon || '',
                level: form.level,
                sort: form.sort
            };
            await updateMerchantCategory(data);
            ElMessage.success('分类更新成功');
        } else {
            // 新增
            const data = {
                pid: form.pid,
                name: form.name,
                icon: form.icon || '',
                level: form.level,
                sort: form.sort
            };
            await createMerchantCategory(data);
            ElMessage.success('分类创建成功');
        }
        
        dialogVisible.value = false;
        loadCategoryList();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('保存分类失败:', error);
            ElMessage.error(error.message || '保存分类失败');
        }
    } finally {
        saving.value = false;
    }
};

// 删除分类
const handleDelete = async (row: ProductCategory) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除分类"${row.name}"吗？此操作不可恢复。`,
            '删除确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        );

        await deleteMerchantCategory(row.id);
        ElMessage.success('删除成功');
        loadCategoryList();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('删除分类失败:', error);
            ElMessage.error('删除分类失败');
        }
    }
};

// 切换显示状态
const handleToggleShow = async (row: ProductCategory) => {
    updating.value = true;
    try {
        await toggleMerchantCategoryShow(row.id);
        ElMessage.success('状态更新成功');
        loadCategoryList();
    } catch (error) {
        console.error('状态更新失败:', error);
        ElMessage.error('状态更新失败');
        // 恢复原状态
        row.isShow = !row.isShow;
    } finally {
        updating.value = false;
    }
};
</script>

<style scoped lang="scss">
.category-management-page {
    padding: 12px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

// 页面标题
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 12px 20px;
    background: #f5f7fa;
    border-radius: 12px;
    border: 1px solid #e4e7ed;

    .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
            color: #606266;
            font-size: 20px;
        }

        .page-title {
            font-size: 20px;
            font-weight: 700;
            color: #303133;
            margin: 0;
        }
    }

    .header-actions {
        display: flex;
        gap: 12px;

        .btn-icon {
            margin-right: 4px;
        }
    }
}

// 表格卡片
.table-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    :deep(.el-card__body) {
        padding: 20px;
    }
}

// 分类名称
.category-name {
    display: flex;
    align-items: center;
    font-weight: 500;
}

// 操作按钮
.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

// 表单提示
.form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    line-height: 1.5;
}

// 表格样式优化
:deep(.el-table) {
    border-radius: 8px;
    
    th.el-table__cell {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 600;
    }
    
    .el-table__body tr:hover > td {
        background-color: #f5f7fa;
    }
}
</style>
