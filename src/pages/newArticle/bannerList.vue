<template>
    <div class="banner-management-page">
        <!-- 页面标题 -->
        <div class="page-header">
            <div class="header-left">
                <el-icon class="header-icon" :size="20">
                    <Picture />
                </el-icon>
                <h1 class="page-title">轮播图管理</h1>
            </div>
            <div class="header-actions">
                <el-button type="primary" size="large" @click="handleAdd" round>
                    <el-icon class="btn-icon">
                        <Plus />
                    </el-icon>
                    新增轮播图
                </el-button>
            </div>
        </div>

        <!-- 数据表格区域 -->
        <div class="table-section">
            <el-card>
                <el-table v-loading="loading" :data="bannerList" style="width: 100%">
                    <!-- 轮播图封面 -->
                    <el-table-column label="轮播图封面" width="200" align="center">
                        <template #default="{ row }">
                            <el-image 
                                :src="row.cover" 
                                class="banner-cover-img" 
                                fit="cover"
                                :preview-src-list="[row.cover]"
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
                        </template>
                    </el-table-column>

                    <!-- 类型列 -->
                    <el-table-column label="类型" width="120" align="center">
                        <template #default="{ row }">
                            <el-tag :type="getTypeColor(row.type)">{{ getTypeText(row.type) }}</el-tag>
                        </template>
                    </el-table-column>

                    <!-- 排序列 -->
                    <el-table-column label="排序" prop="sort" width="100" align="center" />

                    <!-- 状态列 -->
                    <el-table-column label="状态" width="120" align="center">
                        <template #default="{ row }">
                            <el-tag :type="row.status ? 'success' : 'info'">
                                {{ row.status ? '启用' : '禁用' }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <!-- 创建时间列 -->
                    <el-table-column label="创建时间" width="180" prop="createTime">
                        <template #default="{ row }">
                            <div v-if="row.createTime">
                                {{ formatTime(row.createTime) }}
                            </div>
                            <span v-else class="text-muted">-</span>
                        </template>
                    </el-table-column>

                    <!-- 操作列 -->
                    <el-table-column label="操作" width="140" fixed="right" align="center">
                        <template #default="{ row }">
                            <el-popconfirm
                                title="确定要取消该轮播图吗？"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                @confirm="handleCancel(row)"
                            >
                                <template #reference>
                                    <el-button size="small" text type="danger">
                                        <el-icon>
                                            <Close />
                                        </el-icon>
                                        取消轮播
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页控制 -->
                <div class="pagination-section">
                    <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                        :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </el-card>
        </div>

        <!-- 新增轮播图弹窗 -->
        <el-dialog v-model="dialogVisible" title="新增轮播图" width="500px" destroy-on-close>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="封面图片" prop="cover">
                    <div class="cover-upload">
                        <el-input v-model="form.cover" placeholder="请输入封面图片URL" />
                        <div class="upload-tips">
                            <span>建议尺寸：750x420px，大小不超过2MB，支持jpg、png格式</span>
                        </div>
                        <el-image 
                            v-if="form.cover" 
                            :src="form.cover" 
                            class="cover-preview" 
                            fit="cover"
                            :preview-src-list="[form.cover]"
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
                    </div>
                </el-form-item>

                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="form.sort" :min="0" :max="9999" style="width: 100%" />
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
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { Plus, Picture, Close } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
    getBannerList,
    createBanner,
    cancelBanner,
    Article,
    BannerListResponse
} from '@/api/article';

// 响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const bannerList = ref<Article[]>([]);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();

const pagination = reactive({
    current: 1,
    size: 10,
    total: 0
});

const form = reactive({
    cover: '',
    sort: 0
});

const rules: FormRules = {
    cover: [
        { required: true, message: '请输入封面图片URL', trigger: 'blur' },
        { max: 255, message: 'URL最多255个字符', trigger: 'blur' }
    ],
    sort: [
        { required: true, message: '请输入排序', trigger: 'blur' }
    ]
};

// 生命周期
onMounted(() => {
    loadBannerList();
});

// 加载轮播图列表
const loadBannerList = async () => {
    loading.value = true;
    try {
        const params = {
            page: pagination.current,
            limit: pagination.size
        };
        const response = await getBannerList(params) as unknown as BannerListResponse;
        bannerList.value = response.list || [];
        pagination.total = response.total || 0;
    } catch (error) {
        ElMessage.error('加载轮播图列表失败');
        console.error('加载轮播图列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 分页相关方法
const handleSizeChange = (size: number) => {
    pagination.size = size;
    pagination.current = 1;
    loadBannerList();
};

const handleCurrentChange = (page: number) => {
    pagination.current = page;
    loadBannerList();
};

// 新增轮播图
const handleAdd = () => {
    Object.assign(form, {
        cover: '',
        sort: 0
    });
    dialogVisible.value = true;
};

// 取消轮播图
const handleCancel = async (row: Article) => {
    try {
        await cancelBanner(row.id);
        ElMessage.success('取消轮播图成功');
        loadBannerList();
    } catch (error) {
        ElMessage.error('取消轮播图失败');
    }
};

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return;

    try {
        await formRef.value.validate();
        submitLoading.value = true;

        // 使用固定值填充其他字段
        await createBanner({
            cid: 2,
            type: 0,
            title: '1',
            author: '1',
            cover: form.cover,
            synopsis: '1',
            content: '1',
            sort: form.sort
        });

        ElMessage.success('新增轮播图成功');
        dialogVisible.value = false;
        loadBannerList();
    } catch (error: any) {
        if (error !== 'cancel' && error !== false) {
            ElMessage.error('新增轮播图失败');
        }
    } finally {
        submitLoading.value = false;
    }
};

// 格式化方法
const formatTime = (time: string) => {
    return dayjs(time).format('YYYY-MM-DD HH:mm');
};

const getTypeColor = (type: number) => {
    return type === 0 ? 'primary' : 'success';
};

const getTypeText = (type: number) => {
    return type === 0 ? '新闻' : '咨询';
};
</script>

<style lang="scss" scoped>
.banner-management-page {
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

.table-section {
    margin-bottom: 20px;
}

.banner-cover-img {
    width: 150px;
    height: 100px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        transform: scale(1.05);
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

.pagination-section {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.text-muted {
    color: #c0c4cc;
}

.cover-upload {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    .upload-tips {
        font-size: 12px;
        color: #909399;
        line-height: 1.5;
        margin-top: -5px;
    }

    .cover-preview {
        width: 200px;
        height: 120px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            transform: scale(1.05);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .banner-management-page {
        padding: 16px;
    }

    .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .banner-cover-img {
        width: 100px;
        height: 70px;
    }
}
</style>
