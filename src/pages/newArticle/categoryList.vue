<template>
    <div class="category-management-page">
        <!-- 页面标题 -->
        <div class="page-header">
            <div class="header-left">
                <el-icon class="header-icon" :size="20">
                    <Menu />
                </el-icon>
                <h1 class="page-title">文章分类管理</h1>
            </div>
            <div class="header-actions">
                <el-button type="primary" size="large" @click="handleAdd" round>
                    <el-icon class="btn-icon">
                        <Plus />
                    </el-icon>
                    新增分类
                </el-button>
            </div>
        </div>

        <!-- 数据表格区域 -->
        <div class="table-section">
            <el-card>
                <el-table v-loading="loading" :data="sortedCategoryList" style="width: 100%" @sort-change="handleSortChange">
                    <el-table-column label="ID" prop="id" width="80" align="center" />

                    <el-table-column label="分类图标" width="100" align="center">
                        <template #default="{ row }">
                            <el-image 
                                v-if="row.icon" 
                                :src="row.icon" 
                                class="category-icon" 
                                fit="cover"
                                :preview-src-list="[row.icon]"
                                preview-teleported
                            >
                                <template #error>
                                    <div class="image-slot">
                                        <el-icon>
                                            <Picture />
                                        </el-icon>
                                    </div>
                                </template>
                            </el-image>
                            <span v-else class="text-muted">-</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="分类名称" prop="name" min-width="150" />

                    <el-table-column label="排序" prop="sort" width="100" align="center" sortable="custom" />

                    <el-table-column label="状态" width="100" align="center">
                        <template #default="{ row }">
                            <el-switch v-model="row.status" @change="handleStatusChange(row)" />
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="180" fixed="right" align="center">
                        <template #default="{ row }">
                            <el-button size="small" text type="primary" @click="handleEdit(row)">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                                编辑
                            </el-button>
                            <el-button size="small" text type="danger" @click="handleDelete(row)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <!-- 新增/编辑弹窗 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" destroy-on-close>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入分类名称" maxlength="20" show-word-limit />
                </el-form-item>

                <el-form-item label="分类图标" prop="icon">
                    <div class="icon-upload">
                        <ImageUpload v-model="form.icon" model="article" :pid="5" placeholder="上传图标" />
                        <div class="upload-tips">
                            <span>建议尺寸：100x100px，大小不超过500KB，支持jpg、png格式</span>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="form.sort" :min="0" :max="9999" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Plus, Edit, Delete, Picture, Menu } from '@element-plus/icons-vue';
import ImageUpload from '@/components/ImageUpload/index.vue';
import {
    getArticleCategoryList,
    createArticleCategory,
    updateArticleCategory,
    deleteArticleCategory,
    switchArticleCategory,
    ArticleCategory
} from '@/api/article';

// 响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const categoryList = ref<ArticleCategory[]>([]);
const sortOrder = ref<'ascending' | 'descending' | null>(null);
const sortProp = ref<string>('');
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref<FormInstance>();

const form = reactive({
    id: 0,
    name: '',
    icon: '',
    sort: 0
});

const rules: FormRules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { max: 20, message: '分类名称最多20个字符', trigger: 'blur' }
    ],
    sort: [
        { required: true, message: '请输入排序', trigger: 'blur' }
    ]
};

const dialogTitle = computed(() => isEdit.value ? '编辑分类' : '新增分类');

// 排序后的分类列表
const sortedCategoryList = computed(() => {
    if (!sortProp.value || !sortOrder.value) {
        return categoryList.value;
    }
    const list = [...categoryList.value];
    list.sort((a, b) => {
        const aVal = (a as any)[sortProp.value];
        const bVal = (b as any)[sortProp.value];
        if (sortOrder.value === 'ascending') {
            return aVal - bVal;
        } else {
            return bVal - aVal;
        }
    });
    return list;
});

// 排序变化处理
const handleSortChange = ({ prop, order }: { prop: string; order: 'ascending' | 'descending' | null }) => {
    sortProp.value = prop;
    sortOrder.value = order;
};

// 生命周期
onMounted(() => {
    loadCategoryList();
});

// 加载分类列表
const loadCategoryList = async () => {
    loading.value = true;
    try {
        const response = await getArticleCategoryList() as unknown as ArticleCategory[];
        categoryList.value = response || [];
    } catch (error) {
        ElMessage.error('加载分类列表失败');
        console.error('加载分类列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 新增分类
const handleAdd = () => {
    isEdit.value = false;
    Object.assign(form, {
        id: 0,
        name: '',
        icon: '',
        sort: 0
    });
    dialogVisible.value = true;
};

// 编辑分类
const handleEdit = (row: ArticleCategory) => {
    isEdit.value = true;
    Object.assign(form, {
        id: row.id,
        name: row.name,
        icon: row.icon || '',
        sort: row.sort
    });
    dialogVisible.value = true;
};

// 删除分类
const handleDelete = async (row: ArticleCategory) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除分类 "${row.name}" 吗？`,
            '警告',
            { type: 'warning' }
        );
        await deleteArticleCategory(row.id);
        ElMessage.success('删除成功');
        loadCategoryList();
    } catch (error: any) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败');
        }
    }
};

// 状态切换
const handleStatusChange = async (row: ArticleCategory) => {
    try {
        await switchArticleCategory(row.id);
        ElMessage.success(`${row.status ? '启用' : '禁用'}成功`);
    } catch (error) {
        row.status = !row.status;
        ElMessage.error('操作失败');
    }
};

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return;

    try {
        await formRef.value.validate();
        submitLoading.value = true;

        if (isEdit.value) {
            await updateArticleCategory({
                id: form.id,
                name: form.name,
                icon: form.icon || undefined,
                sort: form.sort
            });
            ElMessage.success('编辑成功');
        } else {
            await createArticleCategory({
                name: form.name,
                icon: form.icon || undefined,
                sort: form.sort
            });
            ElMessage.success('新增成功');
        }

        dialogVisible.value = false;
        loadCategoryList();
    } catch (error: any) {
        if (error !== 'cancel' && error !== false) {
            ElMessage.error(isEdit.value ? '编辑失败' : '新增失败');
        }
    } finally {
        submitLoading.value = false;
    }
};
</script>

<style lang="scss" scoped>
.category-management-page {
    padding: 12px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

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
    }
}

.btn-icon {
    margin-right: 4px;
}

.category-icon {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        transform: scale(1.2);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    }
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
}

.text-muted {
    color: #c0c4cc;
}

.icon-upload {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .upload-tips {
        font-size: 12px;
        color: #909399;
        line-height: 1.5;
        margin-top: -5px;
    }

    .icon-preview {
        width: 60px;
        height: 60px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
        }
    }
}
</style>
