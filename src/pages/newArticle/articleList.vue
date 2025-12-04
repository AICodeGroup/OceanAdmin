<template>
    <div class="article-management-page">

        <!-- 页面标题 -->
        <div class="page-header">
            <h1 class="page-title">文章管理</h1>
            <div class="header-actions">
                <el-button type="primary" @click="handleAddArticle">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    新增文章
                </el-button>

                <el-button @click="handleExport">
                    <el-icon>
                        <Download />
                    </el-icon>
                    导出数据
                </el-button>
            </div>
        </div>

        <!-- 第一部分：搜索筛选区域 -->
        <div class="search-section">
            <el-card class="search-card">
                <el-form :model="searchForm" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="关键词">
                                <el-input v-model="searchForm.keyword" placeholder="标题/作者" clearable
                                    @keyup.enter="handleSearch">
                                    <template #prefix>
                                        <el-icon>
                                            <Search />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="文章类型">
                                <el-select v-model="searchForm.type" placeholder="全部类型" clearable style="width: 100%">
                                    <el-option label="图文" :value="1" />
                                    <el-option label="视频" :value="2" />
                                    <el-option label="音频" :value="3" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="状态">
                                <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 100%">
                                    <el-option label="启用" :value="true" />
                                    <el-option label="禁用" :value="false" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item>
                                <el-button @click="handleReset">重置</el-button>
                                <el-button type="primary" @click="handleSearch">
                                    <el-icon>
                                        <Search />
                                    </el-icon>
                                    搜索
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </div>

        <!-- 第二部分：数据表格区域 -->
        <div class="table-section">
            <el-card>
                <!-- 表格操作栏 -->
                <div class="table-actions">
                    <div class="action-left">
                        <el-button :disabled="selectedRows.length === 0" @click="handleBatchEnable">
                            <el-icon>
                                <Check />
                            </el-icon>
                            批量启用
                        </el-button>
                        <el-button :disabled="selectedRows.length === 0" type="warning" @click="handleBatchDisable">
                            <el-icon>
                                <Close />
                            </el-icon>
                            批量禁用
                        </el-button>
                        <el-button :disabled="selectedRows.length === 0" type="danger" @click="handleBatchDelete">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            批量删除
                        </el-button>
                    </div>

                    <div class="action-right">
                        <el-button text @click="handleRefresh">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                            刷新
                        </el-button>
                        <el-button text>
                            <el-icon>
                                <Setting />
                            </el-icon>
                            列设置
                        </el-button>
                    </div>
                </div>

                <!-- 文章数据表格 -->
                <el-table v-loading="loading" :data="articleList" @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <el-table-column type="selection" width="55" />

                    <!-- 文章信息列 -->
                    <el-table-column label="文章信息" min-width="300">
                        <template #default="{ row }">
                            <div class="article-info-cell">
                                <el-image :src="row.cover" class="article-cover" fit="cover">
                                    <template #error>
                                        <div class="image-slot">
                                            <el-icon>
                                                <Picture />
                                            </el-icon>
                                        </div>
                                    </template>
                                </el-image>
                                <div class="article-details">
                                    <div class="article-title">{{ row.title }}</div>
                                    <div class="article-synopsis">{{ row.synopsis || '无简介' }}</div>
                                    <div class="article-meta">
                                        <el-tag size="small" v-if="row.isHot" type="danger">热门</el-tag>
                                        <el-tag size="small" v-if="row.isBanner" type="warning">轮播</el-tag>
                                        <span class="author">作者：{{ row.author }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 类型列 -->
                    <el-table-column label="类型" width="100" align="center">
                        <template #default="{ row }">
                            <el-tag :type="getTypeColor(row.type)">{{ getTypeText(row.type) }}</el-tag>
                        </template>
                    </el-table-column>

                    <!-- 排序列 -->
                    <el-table-column label="排序" prop="sort" width="80" align="center" />

                    <!-- 状态列 -->
                    <el-table-column label="状态" width="100" align="center">
                        <template #default="{ row }">
                            <el-switch v-model="row.status" @change="handleStatusChange(row)" />
                        </template>
                    </el-table-column>

                    <!-- 创建时间列 -->
                    <el-table-column label="创建时间" width="160" prop="createTime">
                        <template #default="{ row }">
                            <div v-if="row.createTime">
                                {{ formatTime(row.createTime) }}
                            </div>
                            <span v-else class="text-muted">-</span>
                        </template>
                    </el-table-column>

                    <!-- 操作列 -->
                    <el-table-column label="操作" width="220" fixed="right">
                        <template #default="{ row }">
                            <div class="action-buttons">
                                <el-button size="small" text type="primary" @click="handleEdit(row)">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                    编辑
                                </el-button>
                                <el-button size="small" text type="info" @click="handleView(row)">
                                    <el-icon>
                                        <View />
                                    </el-icon>
                                    查看
                                </el-button>
                                <el-button size="small" text type="danger" @click="handleDelete(row)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    删除
                                </el-button>
                            </div>
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';

// 图标引入
import {
    Search, Plus, Download, Check, Close, Delete,
    Refresh, Setting, Edit, View, Picture
} from '@element-plus/icons-vue';

// API导入
import { getArticleList, deleteArticle, switchArticle, Article, ArticleListResponse } from '@/api/article';

// 类型定义
interface SearchForm {
    keyword: string;
    type: number | string;
    status: boolean | string;
}

interface Pagination {
    current: number;
    size: number;
    total: number;
}

// 响应式数据
const loading = ref(false);
const articleList = ref<Article[]>([]);
const selectedRows = ref<Article[]>([]);

const searchForm = reactive<SearchForm>({
    keyword: '',
    type: '',
    status: ''
});

const pagination = reactive<Pagination>({
    current: 1,
    size: 20,
    total: 0
});

// 生命周期
onMounted(() => {
    loadArticleList();
});

// 加载文章列表
const loadArticleList = async () => {
    loading.value = true;
    try {
        const params = {
            page: pagination.current,
            limit: pagination.size,
            keyword: searchForm.keyword || undefined,
            type: searchForm.type || undefined,
            status: searchForm.status !== '' ? searchForm.status : undefined,
        };

        const response = await getArticleList(params) as unknown as ArticleListResponse;
        articleList.value = response.list || [];
        pagination.total = response.total || 0;
    } catch (error) {
        ElMessage.error('加载文章列表失败');
        console.error('加载文章列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 搜索相关方法
const handleSearch = () => {
    pagination.current = 1;
    loadArticleList();
};

const handleReset = () => {
    Object.assign(searchForm, {
        keyword: '',
        type: '',
        status: ''
    });
    handleSearch();
};

// 分页相关方法
const handleSizeChange = (size: number) => {
    pagination.size = size;
    pagination.current = 1;
    loadArticleList();
};

const handleCurrentChange = (page: number) => {
    pagination.current = page;
    loadArticleList();
};

// 表格选择
const handleSelectionChange = (selection: Article[]) => {
    selectedRows.value = selection;
};

// 操作相关方法
const handleAddArticle = () => {
    ElMessage.info('打开新增文章窗口');
};

const handleEdit = (article: Article) => {
    ElMessage.info(`编辑文章: ${article.title}`);
};

const handleView = (article: Article) => {
    ElMessage.info(`查看文章: ${article.title}`);
};

const handleDelete = async (article: Article) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除文章 "${article.title}" 吗？此操作不可恢复！`,
            '警告',
            { type: 'error' }
        );
        await deleteArticle(article.id);
        ElMessage.success('删除成功');
        loadArticleList();
    } catch (error: any) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败');
        }
    }
};

const handleStatusChange = async (article: Article) => {
    try {
        await switchArticle(article.id);
        ElMessage.success(`${article.status ? '启用' : '禁用'}成功`);
    } catch (error) {
        article.status = !article.status;
        ElMessage.error('操作失败');
    }
};

const handleExport = () => {
    ElMessage.success('导出数据功能');
};

const handleRefresh = () => {
    loadArticleList();
};

// 批量操作
const handleBatchEnable = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要启用选中的 ${selectedRows.value.length} 篇文章吗？`,
            '提示',
            { type: 'warning' }
        );
        // TODO: 批量启用API
        ElMessage.success('批量启用成功');
        loadArticleList();
    } catch (error) {
        // 用户取消
    }
};

const handleBatchDisable = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要禁用选中的 ${selectedRows.value.length} 篇文章吗？`,
            '提示',
            { type: 'warning' }
        );
        // TODO: 批量禁用API
        ElMessage.success('批量禁用成功');
        loadArticleList();
    } catch (error) {
        // 用户取消
    }
};

const handleBatchDelete = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要删除选中的 ${selectedRows.value.length} 篇文章吗？此操作不可恢复！`,
            '警告',
            { type: 'error' }
        );
        // TODO: 批量删除API
        ElMessage.success('批量删除成功');
        loadArticleList();
    } catch (error) {
        // 用户取消
    }
};

// 格式化方法
const formatTime = (time: string) => {
    return dayjs(time).format('YYYY-MM-DD HH:mm');
};

const getTypeColor = (type: number) => {
    const colorMap: { [key: number]: string } = {
        1: 'primary',
        2: 'success',
        3: 'warning'
    };
    return colorMap[type] || 'info';
};

const getTypeText = (type: number) => {
    const textMap: { [key: number]: string } = {
        1: '图文',
        2: '视频',
        3: '音频'
    };
    return textMap[type] || '未知';
};
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.article-management-page {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin: 0;
    }

    .header-actions {
        display: flex;
        gap: 12px;
    }
}

.search-section {
    margin-bottom: 20px;

    .search-card {
        :deep(.el-card__body) {
            padding: 20px;
        }
    }
}

.table-section {
    margin-bottom: 20px;

    .table-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .action-left,
        .action-right {
            display: flex;
            gap: 8px;
        }
    }
}

.article-info-cell {
    display: flex;
    align-items: flex-start;
    gap: 12px;

    .article-cover {
        width: 80px;
        height: 60px;
        border-radius: 4px;
        flex-shrink: 0;

        .image-slot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background: #f5f7fa;
            color: #909399;
        }
    }

    .article-details {
        flex: 1;
        min-width: 0;

        .article-title {
            font-weight: 600;
            color: #303133;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .article-synopsis {
            font-size: 12px;
            color: #909399;
            margin-bottom: 6px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .article-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;

            .author {
                color: #606266;
            }
        }
    }
}

.action-buttons {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
}

.pagination-section {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.text-muted {
    color: #c0c4cc;
}

// 响应式设计
@media (max-width: 768px) {
    .article-management-page {
        padding: 16px;
    }

    .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .table-actions {
        flex-direction: column;
        gap: 12px;

        .action-right {
            justify-content: flex-start;
        }
    }

    .article-info-cell {
        .article-cover {
            width: 60px;
            height: 45px;
        }
    }
}
</style>