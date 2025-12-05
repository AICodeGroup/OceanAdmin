<template>
    <div class="article-management-page">

        <!-- 页面标题 -->
        <div class="page-header">
            <div class="header-left">
                <el-icon class="header-icon" :size="28">
                    <Management />
                </el-icon>
                <h1 class="page-title">文章管理</h1>
            </div>
            <div class="header-actions">
                <el-button type="primary" size="large" @click="handleAddArticle" round>
                    <el-icon class="btn-icon">
                        <Plus />
                    </el-icon>
                    新增文章
                </el-button>

                <el-button size="large" @click="handleExport" round>
                    <el-icon class="btn-icon">
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
                                <el-input 
                                    v-model="searchForm.keyword" 
                                    placeholder="搜索标题或作者" 
                                    clearable
                                    size="large"
                                    @keyup.enter="handleSearch"
                                >
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
                                <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%">
                                    <el-option label="新闻" :value="0">
                                        <span style="float: left">新闻</span>
                                        <el-tag size="small" type="primary" style="float: right; margin-top: 2px">NEWS</el-tag>
                                    </el-option>
                                    <el-option label="咨询" :value="1">
                                        <span style="float: left">咨询</span>
                                        <el-tag size="small" type="success" style="float: right; margin-top: 2px">INFO</el-tag>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="状态">
                                <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%">
                                    <el-option label="启用" :value="1">
                                        <el-icon color="#67c23a" style="vertical-align: middle; margin-right: 8px"><CircleCheck /></el-icon>
                                        <span>启用</span>
                                    </el-option>
                                    <el-option label="禁用" :value="0">
                                        <el-icon color="#909399" style="vertical-align: middle; margin-right: 8px"><CircleClose /></el-icon>
                                        <span>禁用</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item>
                                <el-space>
                                    <el-button size="large" @click="handleReset" round>
                                        <el-icon class="btn-icon"><RefreshLeft /></el-icon>
                                        重置
                                    </el-button>
                                    <el-button type="primary" size="large" @click="handleSearch" round>
                                        <el-icon class="btn-icon"><Search /></el-icon>
                                        搜索
                                    </el-button>
                                </el-space>
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
                        <el-button :disabled="selectedRows.length === 0" size="large" @click="handleBatchEnable" round>
                            <el-icon class="btn-icon"><Check /></el-icon>
                            批量启用
                        </el-button>
                        <el-button :disabled="selectedRows.length === 0" type="warning" size="large" @click="handleBatchDisable" round>
                            <el-icon class="btn-icon"><Close /></el-icon>
                            批量禁用
                        </el-button>
                        <el-button :disabled="selectedRows.length === 0" type="danger" size="large" @click="handleBatchDelete" round>
                            <el-icon class="btn-icon"><Delete /></el-icon>
                            批量删除
                        </el-button>
                    </div>

                    <div class="action-right">
                        <el-button text size="large" @click="handleRefresh" round>
                            <el-icon class="btn-icon"><Refresh /></el-icon>
                            刷新
                        </el-button>
                        <el-button text size="large">
                            <el-icon class="btn-icon"><Setting /></el-icon>
                            列设置
                        </el-button>
                    </div>
                </div>

                <!-- 文章数据表格 -->
                <el-table v-loading="loading" :data="articleList" @selection-change="handleSelectionChange" style="width: 100%">
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
                    <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size" :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>
            </el-card>
        </div>

        <!-- 新增/编辑文章弹窗 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="1000px" destroy-on-close :close-on-click-modal="false" draggable>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" size="large" label-position="right">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="文章分类" prop="cid">
                            <el-select v-model="form.cid" placeholder="请选择分类" filterable style="width: 100%">
                                <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
                                    <span style="float: left">{{ item.name }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">ID: {{ item.id }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="文章类型" prop="type">
                            <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                                <el-option label="新闻" :value="0">
                                    <el-tag type="primary" size="small">新闻</el-tag>
                                </el-option>
                                <el-option label="咨询" :value="1">
                                    <el-tag type="success" size="small">咨询</el-tag>
                                </el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入文章标题，建议不超过50个字" maxlength="200" show-word-limit clearable>
                        <template #prefix>
                            <el-icon><Document /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="作者" prop="author">
                            <el-input v-model="form.author" placeholder="请输入作者姓名" maxlength="50" clearable>
                                <template #prefix>
                                    <el-icon><User /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="form.sort" :min="0" :max="9999" :step="1" controls-position="right" style="width: 100%" />
                            <div class="form-tip">数字越小，排序越靠前</div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="封面图片" prop="cover">
                    <div class="cover-upload-container">
                        <el-input v-model="form.cover" placeholder="请输入图片URL地址" clearable>
                            <template #prefix>
                                <el-icon><Picture /></el-icon>
                            </template>
                        </el-input>
                        <el-alert title="建议尺寸：750x420px，大小不超过2MB，支持jpg、png格式" type="info" :closable="false" show-icon />
                        <el-image v-if="form.cover" :src="form.cover" class="cover-preview" fit="cover" :preview-src-list="[form.cover]" preview-teleported>
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><Picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                    </div>
                </el-form-item>

                <el-form-item label="是否热门">
                    <el-switch v-model="form.isHot" active-text="设为热门" inactive-text="取消热门" active-color="#f56c6c" :inline-prompt="true" />
                    <div class="form-tip">热门文章将在首页优先展示</div>
                </el-form-item>

                <el-form-item label="文章简介" prop="synopsis">
                    <el-input v-model="form.synopsis" type="textarea" :rows="3" placeholder="请输入文章简介，建议100字以内" maxlength="200" show-word-limit resize="none" />
                </el-form-item>

                <el-form-item label="文章内容" prop="content">
                    <el-input v-model="form.content" type="textarea" :rows="10" placeholder="请输入文章详细内容" resize="vertical" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button size="large" @click="dialogVisible = false" round>
                        <el-icon class="btn-icon"><Close /></el-icon>
                        取消
                    </el-button>
                    <el-button type="primary" size="large" :loading="submitLoading" @click="handleSubmit" round>
                        <el-icon class="btn-icon" v-if="!submitLoading"><Check /></el-icon>
                        {{ isEdit ? '保存修改' : '立即创建' }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 查看文章详情弹窗 -->
        <el-dialog v-model="viewDialogVisible" title="文章详情" width="900px" destroy-on-close>
            <el-descriptions :column="2" border v-if="currentArticle">
                <el-descriptions-item label="文章ID">{{ currentArticle.id }}</el-descriptions-item>
                <el-descriptions-item label="文章类型">
                    <el-tag :type="getTypeColor(currentArticle.type)">{{ getTypeText(currentArticle.type) }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="文章标题" :span="2">{{ currentArticle.title }}</el-descriptions-item>
                <el-descriptions-item label="作者">{{ currentArticle.author }}</el-descriptions-item>
                <el-descriptions-item label="排序">{{ currentArticle.sort }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                    <el-tag :type="currentArticle.status === 1 ? 'success' : 'info'">
                        {{ currentArticle.status === 1 ? '启用' : '禁用' }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否热门" :span="2">
                    <el-tag v-if="currentArticle.isHot" type="danger" size="large">是</el-tag>
                    <el-tag v-else type="info" size="large">否</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">
                    {{ currentArticle.createTime ? formatTime(currentArticle.createTime) : '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="更新时间">
                    {{ currentArticle.updateTime ? formatTime(currentArticle.updateTime) : '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="封面图片" :span="2">
                    <el-image :src="currentArticle.cover" style="width: 200px; height: 120px; border-radius: 4px;" fit="cover" :preview-src-list="[currentArticle.cover]" preview-teleported>
                        <template #error>
                            <div class="image-slot" style="width: 200px; height: 120px;">
                                <el-icon><Picture /></el-icon>
                            </div>
                        </template>
                    </el-image>
                </el-descriptions-item>
                <el-descriptions-item label="文章简介" :span="2">
                    <div class="article-synopsis-detail">{{ currentArticle.synopsis || '无' }}</div>
                </el-descriptions-item>
                <el-descriptions-item label="文章内容" :span="2">
                    <div class="article-content-detail">{{ currentArticle.content || '无' }}</div>
                </el-descriptions-item>
            </el-descriptions>

            <template #footer>
                <el-button @click="viewDialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="handleEditFromView">编辑</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import dayjs from 'dayjs';

// 图标引入
import {
    Search, Plus, Download, Check, Close, Delete,
    Refresh, Setting, Edit, View, Picture, Management,
    RefreshLeft, CircleCheck, CircleClose, Document, User
} from '@element-plus/icons-vue';

// API导入
import { 
    getArticleList, 
    deleteArticle, 
    switchArticle, 
    createArticle,
    updateArticle,
    getArticleDetail,
    getArticleCategoryList,
    batchEnableArticle,
    batchDisableArticle,
    batchDeleteArticle,
    Article, 
    ArticleListResponse,
    ArticleCategory 
} from '@/api/article';

// 类型定义
interface SearchForm {
    keyword: string;
    type: number | string;
    status: number | string;
}

interface Pagination {
    current: number;
    size: number;
    total: number;
}

// 响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const articleList = ref<Article[]>([]);
const selectedRows = ref<Article[]>([]);
const categoryList = ref<ArticleCategory[]>([]);
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogTitle = ref('新增文章');
const isEdit = ref(false);
const currentArticle = ref<Article | null>(null);
const formRef = ref<FormInstance>();

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

const form = reactive({
    id: undefined as number | undefined,
    cid: undefined as number | undefined,
    type: undefined as number | undefined,
    title: '',
    author: '',
    cover: '',
    synopsis: '',
    content: '',
    sort: 0,
    isHot: false,
    isBanner: false
});

const rules: FormRules = {
    cid: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
    type: [{ required: true, message: '请选择文章类型', trigger: 'change' }],
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { max: 200, message: '标题最多200个字符', trigger: 'blur' }
    ],
    author: [
        { required: true, message: '请输入作者', trigger: 'blur' },
        { max: 50, message: '作者最多50个字符', trigger: 'blur' }
    ],
    cover: [
        { required: true, message: '请输入封面图片URL', trigger: 'blur' },
        { max: 255, message: 'URL最多255个字符', trigger: 'blur' }
    ],
    synopsis: [
        { required: true, message: '请输入文章简介', trigger: 'blur' },
        { max: 200, message: '简介最多200个字符', trigger: 'blur' }
    ],
    content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
};

// 生命周期
onMounted(() => {
    loadArticleList();
    loadCategoryList();
});

// 加载文章列表
const loadArticleList = async () => {
    loading.value = true;
    try {
        const params = {
            page: pagination.current,
            limit: pagination.size,
            keyword: searchForm.keyword || undefined,
            type: searchForm.type !== '' ? searchForm.type : undefined,
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

// 加载分类列表
const loadCategoryList = async () => {
    try {
        const response = await getArticleCategoryList() as unknown as ArticleCategory[];
        categoryList.value = response || [];
    } catch (error) {
        console.error('加载分类列表失败:', error);
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
    isEdit.value = false;
    dialogTitle.value = '新增文章';
    Object.assign(form, {
        id: undefined,
        cid: undefined,
        type: undefined,
        title: '',
        author: '',
        cover: '',
        synopsis: '',
        content: '',
        sort: 0,
        isHot: false,
        isBanner: false
    });
    dialogVisible.value = true;
};

const handleEdit = async (article: Article) => {
    isEdit.value = true;
    dialogTitle.value = '编辑文章';
    try {
        const detail = await getArticleDetail(article.id) as unknown as Article;
        Object.assign(form, {
            id: detail.id,
            cid: detail.cid,
            type: detail.type,
            title: detail.title,
            author: detail.author,
            cover: detail.cover,
            synopsis: detail.synopsis,
            content: detail.content,
            sort: detail.sort,
            isHot: detail.isHot,
            isBanner: detail.isBanner
        });
        dialogVisible.value = true;
    } catch (error) {
        ElMessage.error('加载文章详情失败');
    }
};

const handleView = async (article: Article) => {
    try {
        const detail = await getArticleDetail(article.id) as unknown as Article;
        currentArticle.value = detail;
        viewDialogVisible.value = true;
    } catch (error) {
        ElMessage.error('加载文章详情失败');
    }
};

const handleEditFromView = () => {
    viewDialogVisible.value = false;
    if (currentArticle.value) {
        handleEdit(currentArticle.value);
    }
};

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return;

    try {
        await formRef.value.validate();
        submitLoading.value = true;

        const data = {
            cid: form.cid!,
            type: form.type!,
            title: form.title,
            author: form.author,
            cover: form.cover,
            synopsis: form.synopsis,
            content: form.content,
            sort: form.sort,
            isHot: form.isHot,
            isBanner: form.isBanner
        };

        if (isEdit.value && form.id) {
            await updateArticle({ ...data, id: form.id });
            ElMessage.success('编辑文章成功');
        } else {
            await createArticle(data);
            ElMessage.success('新增文章成功');
        }

        dialogVisible.value = false;
        loadArticleList();
    } catch (error: any) {
        if (error !== 'cancel' && error !== false) {
            ElMessage.error(isEdit.value ? '编辑文章失败' : '新增文章失败');
        }
    } finally {
        submitLoading.value = false;
    }
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
        const ids = selectedRows.value.map(row => row.id);
        await batchEnableArticle(ids);
        ElMessage.success('批量启用成功');
        loadArticleList();
    } catch (error: any) {
        if (error !== 'cancel') {
            ElMessage.error('批量启用失败');
        }
    }
};

const handleBatchDisable = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要禁用选中的 ${selectedRows.value.length} 篇文章吗？`,
            '提示',
            { type: 'warning' }
        );
        const ids = selectedRows.value.map(row => row.id);
        await batchDisableArticle(ids);
        ElMessage.success('批量禁用成功');
        loadArticleList();
    } catch (error: any) {
        if (error !== 'cancel') {
            ElMessage.error('批量禁用失败');
        }
    }
};

const handleBatchDelete = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要删除选中的 ${selectedRows.value.length} 篇文章吗？此操作不可恢复！`,
            '警告',
            { type: 'error' }
        );
        const ids = selectedRows.value.map(row => row.id);
        await batchDeleteArticle(ids);
        ElMessage.success('批量删除成功');
        loadArticleList();
    } catch (error: any) {
        if (error !== 'cancel') {
            ElMessage.error('批量删除失败');
        }
    }
};

// 格式化方法
const formatTime = (time: string) => {
    return dayjs(time).format('YYYY-MM-DD HH:mm');
};

const getTypeColor = (type: number) => {
    const colorMap: { [key: number]: string } = {
        0: 'primary',
        1: 'success',
        2: 'warning'
    };
    return colorMap[type] || 'info';
};

const getTypeText = (type: number) => {
    const textMap: { [key: number]: string } = {
        0: '新闻',
        1: '咨询'
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

.search-section {
    margin-bottom: 12px;

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

.article-synopsis-detail,
.article-content-detail {
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-all;
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

// 按钮图标样式
.btn-icon {
    margin-right: 4px;
}

// 弹窗样式
:deep(.el-dialog) {
    border-radius: 12px;
    
    .el-dialog__header {
        padding: 20px 24px;
        background: #f5f7fa;
        border-radius: 12px 12px 0 0;
        border-bottom: 1px solid #e4e7ed;
        
        .el-dialog__title {
            color: #303133;
            font-size: 20px;
            font-weight: 600;
        }
    }
    
    .el-dialog__body {
        padding: 24px;
    }
    
    .el-dialog__footer {
        padding: 16px 24px;
        border-top: 1px solid #e4e7ed;
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

// 表单提示样式
.form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    line-height: 1.5;
}

// 封面上传容器
.cover-upload-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    :deep(.el-alert) {
        margin: 0;
    }
    
    .cover-preview {
        width: 220px;
        height: 130px;
        border-radius: 8px;
        border: 2px dashed #dcdfe6;
        cursor: pointer;
        transition: all 0.3s;
        overflow: hidden;
        
        &:hover {
            transform: scale(1.03);
            border-color: #409eff;
            box-shadow: 0 4px 16px rgba(64, 158, 255, 0.2);
        }
    }
}

// Switch 开关样式优化
:deep(.el-switch) {
    .el-switch__core {
        height: 24px;
        min-width: 50px;
        
        .el-switch__inner {
            font-size: 12px;
        }
    }
}

// 下拉框选项内边距优化
:deep(.el-select-dropdown__item) {
    padding-left: 20px;
    padding-right: 20px;
}

// 表单项间距优化
:deep(.el-form-item) {
    margin-bottom: 24px;
}

// 搜索卡片样式
.search-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    
    :deep(.el-card__body) {
        padding: 24px;
    }
}

// 表格卡片样式
.table-section {
    :deep(.el-card) {
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        
        .el-card__body {
            padding: 20px;
        }
    }
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

// 分页样式
:deep(.el-pagination) {
    .el-pagination__total,
    .el-pagination__jump {
        color: #606266;
    }
    
    .btn-prev,
    .btn-next,
    .el-pager li {
        border-radius: 6px;
        
        &:hover {
            color: #409eff;
        }
    }
    
    .el-pager li.is-active {
        background: #409eff;
        color: #ffffff;
    }
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