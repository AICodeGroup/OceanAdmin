<template>
    <div class="user-management-page">
        <!-- 页面标题 -->
        <div class="page-header">
            <h1 class="page-title">用户管理</h1>
            <div class="header-actions">
                <el-button type="primary" @click="handleAddUser">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    新增用户
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
                                <el-input v-model="searchForm.keyword" placeholder="用户账号/昵称/邮箱/" clearable
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
                            <el-form-item label="账号状态">
                                <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 100%">
                                    <el-option label="正常" value="active" />
                                    <el-option label="禁用" value="disabled" />
                                    <el-option label="冻结" value="frozen" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="注册时间">
                                <el-date-picker v-model="searchForm.registerTime" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%"
                                    value-format="YYYY-MM-DD" />
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="最后登录">
                                <el-date-picker v-model="searchForm.lastLoginTime" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%"
                                    value-format="YYYY-MM-DD" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="24" style="text-align: right">
                            <el-button @click="handleReset">重置</el-button>
                            <el-button type="primary" @click="handleSearch">
                                <el-icon>
                                    <Search />
                                </el-icon>
                                搜索
                            </el-button>
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

                    <div class="action-right">
                        <el-button text @click="handleRefresh">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                            刷新
                        </el-button>
                        <el-button>
                            <el-icon>
                                <Setting />
                            </el-icon>
                            列设置
                        </el-button>
                    </div>
                </div>

                <!-- 用户数据表格 -->
                <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <el-table-column type="selection" width="55" />

                    <!-- 用户基本信息列 -->
                    <el-table-column label="用户信息" min-width="200">
                        <template #default="{ row }">
                            <div class="user-info-cell">
                                <el-avatar :size="40" :src="row.avatar" class="user-avatar">
                                    {{ row.nickname?.charAt(0) || 'U' }}
                                </el-avatar>
                                <div class="user-details">
                                    <div class="user-name">
                                        <span class="username">{{ row.username }}</span>
                                        <el-tag v-if="row.isOnline" size="small" type="success">
                                            在线
                                        </el-tag>
                                    </div>
                                    <div class="user-nickname">{{ row.nickname }}</div>
                                    <div class="user-id">ID: {{ row.userId }}</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 联系信息列 -->
                    <el-table-column label="联系方式" min-width="180">
                        <template #default="{ row }">
                            <div class="contact-info">
                                <div class="contact-item">
                                    <el-icon>
                                        <Iphone />
                                    </el-icon>
                                    <span>{{ formatMobile(row.mobile) }}</span>
                                </div>
                                <div class="contact-item">
                                    <el-icon>
                                        <Message />
                                    </el-icon>
                                    <span>{{ formatEmail(row.email) }}</span>
                                </div>
                                <div class="contact-item" v-if="row.address">
                                    <el-icon>
                                        <Location />
                                    </el-icon>
                                    <el-tooltip :content="row.address">
                                        <span class="address-text">{{ formatAddress(row.address) }}</span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 状态信息列 -->
                    <el-table-column label="状态" width="120" align="center">
                        <template #default="{ row }">
                            <el-tag :type="getStatusType(row.status)">
                                {{ getStatusText(row.status) }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <!-- 时间信息列 -->
                    <el-table-column label="注册时间" width="160" sortable prop="registerTime">
                        <template #default="{ row }">
                            <div class="time-info">
                                <div>{{ formatTime(row.registerTime) }}</div>
                                <div class="time-ago">{{ getTimeAgo(row.registerTime) }}</div>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="最后登录" width="160" sortable prop="lastLoginTime">
                        <template #default="{ row }">
                            <div class="time-info" v-if="row.lastLoginTime">
                                <div>{{ formatTime(row.lastLoginTime) }}</div>
                                <div class="time-ago">{{ getTimeAgo(row.lastLoginTime) }}</div>
                            </div>
                            <span v-else class="text-muted">从未登录</span>
                        </template>
                    </el-table-column>

                    <!-- 操作列 -->
                    <el-table-column label="操作" width="240" fixed="right">
                        <template #default="{ row }">
                            <div class="action-buttons">
                                <el-button size="small" text @click="handleViewDetail(row)">
                                    <el-icon>
                                        <View />
                                    </el-icon>
                                    详情
                                </el-button>

                                <el-button size="small" text type="primary" @click="handleEdit(row)">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                    编辑
                                </el-button>

                                <el-button size="small" text type="warning" @click="handleResetPassword(row)">
                                    <el-icon>
                                        <Key />
                                    </el-icon>
                                    重置密码
                                </el-button>

                                <el-dropdown @command="(command) => handleCommand(command, row)">
                                    <el-button size="small" text>
                                        <el-icon>
                                            <MoreFilled />
                                        </el-icon>
                                        更多
                                    </el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item command="enable" v-if="row.status !== 'active'">
                                                启用账号
                                            </el-dropdown-item>
                                            <el-dropdown-item command="disable" v-if="row.status === 'active'">
                                                禁用账号
                                            </el-dropdown-item>
                                            <el-dropdown-item command="delete" divided>
                                                删除账号
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <!-- 第三部分：分页控制区域 -->
        <div class="pagination-section">
            <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <!-- 用户详情对话框 -->
        <user-detail-dialog v-model="detailDialogVisible" :user-id="currentUserId" @refresh="handleRefresh" />

        <!-- 重置密码对话框 -->
        <reset-password-dialog v-model="resetPasswordDialogVisible" :user="currentUser"
            @success="handlePasswordResetSuccess" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 图标引入
import {
    Search, Plus, Download, Check, Close, Delete,
    Refresh, Setting, Iphone, Message, Location,
    View, Edit, Key, MoreFilled
} from '@element-plus/icons-vue';

// 组件引入
import UserDetailDialog from '@/components/userSetting/userDetailDialog.vue';
import ResetPasswordDialog from '@/components/userSetting/resetPasswordDialog.vue';

// 类型定义
interface User {
    userId: string;
    username: string;
    nickname: string;
    avatar?: string;
    mobile: string;
    email: string;
    address?: string;
    registerTime: string;
    lastLoginTime?: string;
    status: 'active' | 'disabled' | 'frozen';
    isOnline: boolean;
}

interface SearchForm {
    keyword: string;
    status: string;
    registerTime: string[];
    lastLoginTime: string[];
}

interface Pagination {
    current: number;
    size: number;
    total: number;
}

// Day.js 配置
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

// 响应式数据
const loading = ref(false);
const userList = ref<User[]>([]);
const selectedRows = ref<User[]>([]);
const detailDialogVisible = ref(false);
const resetPasswordDialogVisible = ref(false);
const currentUserId = ref('');
const currentUser = ref<User | null>(null);

const searchForm = reactive<SearchForm>({
    keyword: '',
    status: '',
    registerTime: [],
    lastLoginTime: []
});

const pagination = reactive<Pagination>({
    current: 1,
    size: 20,
    total: 0
});

// 计算属性
const hasSelected = computed(() => selectedRows.value.length > 0);

// 生命周期
onMounted(() => {
    loadUserList();
});

// 方法定义
const loadUserList = async () => {
    loading.value = true;
    try {
        // 模拟 API 调用
        const response = await apiGetUsers();
        userList.value = response.data.list;
        pagination.total = response.data.total;
    } catch (error) {
        ElMessage.error('加载用户列表失败');
        console.error('加载用户列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 搜索相关方法
const handleSearch = () => {
    pagination.current = 1;
    loadUserList();
};

const handleReset = () => {
    Object.assign(searchForm, {
        keyword: '',
        status: '',
        registerTime: [],
        lastLoginTime: []
    });
    handleSearch();
};

// 分页相关方法
const handleSizeChange = (size: number) => {
    pagination.size = size;
    pagination.current = 1;
    loadUserList();
};

const handleCurrentChange = (page: number) => {
    pagination.current = page;
    loadUserList();
};

// 表格选择
const handleSelectionChange = (selection: User[]) => {
    selectedRows.value = selection;
};

// 操作相关方法
const handleViewDetail = (user: User) => {
    currentUserId.value = user.userId;
    detailDialogVisible.value = true;
};

const handleEdit = (user: User) => {
    // 编辑用户逻辑
    ElMessage.info(`编辑用户: ${user.username}`);
};

const handleResetPassword = (user: User) => {
    currentUser.value = user;
    resetPasswordDialogVisible.value = true;
};

const handleAddUser = () => {

    ElMessage.info('打开新增用户对话框');
};

const handleExport = () => {
    ElMessage.success('导出数据功能');
};

const handleRefresh = () => {
    loadUserList();
};

// 批量操作
const handleBatchEnable = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要启用选中的 ${selectedRows.value.length} 个用户吗？`,
            '提示',
            { type: 'warning' }
        );
        ElMessage.success('批量启用成功');
        loadUserList();
    } catch (error) {
        // 用户取消
    }
};

const handleBatchDisable = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要禁用选中的 ${selectedRows.value.length} 个用户吗？`,
            '提示',
            { type: 'warning' }
        );
        ElMessage.success('批量禁用成功');
        loadUserList();
    } catch (error) {
        // 用户取消
    }
};

const handleBatchDelete = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要删除选中的 ${selectedRows.value.length} 个用户吗？此操作不可恢复！`,
            '警告',
            { type: 'error' }
        );
        ElMessage.success('批量删除成功');
        loadUserList();
    } catch (error) {
        // 用户取消
    }
};

// 下拉菜单操作
const handleCommand = (command: string, user: User) => {
    switch (command) {
        case 'enable':
            handleEnableUser(user);
            break;
        case 'disable':
            handleDisableUser(user);
            break;
        case 'delete':
            handleDeleteUser(user);
            break;
    }
};

const handleEnableUser = async (user: User) => {
    try {
        await ElMessageBox.confirm(
            `确定要启用用户 "${user.username}" 吗？`,
            '提示',
            { type: 'warning' }
        );
        ElMessage.success('启用成功');
        loadUserList();
    } catch (error) {
        // 用户取消
    }
};

const handleDisableUser = async (user: User) => {
    try {
        await ElMessageBox.confirm(
            `确定要禁用用户 "${user.username}" 吗？`,
            '提示',
            { type: 'warning' }
        );
        ElMessage.success('禁用成功');
        loadUserList();
    } catch (error) {
        // 用户取消
    }
};

const handleDeleteUser = async (user: User) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除用户 "${user.username}" 吗？此操作不可恢复！`,
            '警告',
            { type: 'error' }
        );
        ElMessage.success('删除成功');
        loadUserList();
    } catch (error) {
        // 用户取消
    }
};

// 密码重置成功回调
const handlePasswordResetSuccess = () => {
    ElMessage.success('密码重置成功');
    resetPasswordDialogVisible.value = false;
};

// 格式化方法
const formatMobile = (mobile: string) => {
    if (!mobile) return '-';
    return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

const formatEmail = (email: string) => {
    if (!email) return '-';
    const [name, domain] = email.split('@');
    if (name.length <= 2) {
        return `${name[0]}***@${domain}`;
    }
    return `${name[0]}***${name.slice(-1)}@${domain}`;
};

const formatAddress = (address: string) => {
    if (!address) return '-';
    return address.length > 10 ? address.substring(0, 10) + '...' : address;
};

const formatTime = (time: string) => {
    return dayjs(time).format('YYYY-MM-DD HH:mm');
};

const getTimeAgo = (time: string) => {
    return dayjs(time).fromNow();
};

const getStatusType = (status: string) => {
    const statusMap: { [key: string]: any } = {
        active: 'success',
        disabled: 'warning',
        // 冻结状态
        frozen: 'danger'
    };
    return statusMap[status] || 'info';
};

const getStatusText = (status: string) => {
    const textMap: { [key: string]: string } = {
        active: '正常',
        disabled: '禁用',
        frozen: '冻结'
    };
    return textMap[status] || '未知';
};

// 实际API 请求
const apiGetUsers = async (): Promise<any> => {
    // 构建请求参数
    const params = {
        page: 1,
        limit: 20,

    };

    // 实际API调用
    const response = await fetch('admin/platform/user/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    });

    return await response.json();
};

// 模拟 API
/* const mockApiGetUsers = (): Promise<{ data: { list: User[]; total: number } }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData: User[] = Array.from({ length: 50 }, (_, i) => ({
                userId: `1000${i + 1}`,
                username: `user${i + 1}`,
                nickname: `用户${i + 1}`,
                avatar: i % 3 === 0 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}` : '',
                mobile: `138${String(i).padStart(8, '0')}`,
                email: `user${i + 1}@example.com`,
                address: i % 2 === 0 ? `北京市朝阳区某某街道${i}号` : '',
                registerTime: dayjs().subtract(i * 2, 'day').format('YYYY-MM-DD HH:mm:ss'),
                lastLoginTime: i % 5 !== 0 ? dayjs().subtract(i, 'hour').format('YYYY-MM-DD HH:mm:ss') : '',
                status: i % 10 === 0 ? 'disabled' : i % 20 === 0 ? 'frozen' : 'active',
                isOnline: i % 8 === 0
            }));

            const start = (pagination.current - 1) * pagination.size;
            const end = start + pagination.size;
            const pageData = mockData.slice(start, end);

            resolve({
                data: {
                    list: pageData,
                    total: mockData.length
                }
            });
        }, 500);
    });
}; */
</script>

<style lang="scss" scoped>
.user-management-page {
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
        font-size: px;
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

        .action-right {
            display: flex;
            gap: 8px;
        }
    }
}

.user-info-cell {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-avatar {
        flex-shrink: 0;
    }

    .user-details {
        flex: 1;
        min-width: 0;

        .user-name {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;

            .username {
                font-weight: 600;
                color: #303133;
            }
        }

        .user-nickname {
            font-size: 12px;
            color: 399;
            margin-bottom: 2px;
        }

        .user-id {
            font-size: 12px;
            color: #c0c4cc;
        }
    }
}

.contact-info {
    .contact-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
        font-size: 13px;
        color: #606266;

        &:last-child {
            margin-bottom: 0;
        }

        .address-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}

.time-info {
    font-size: 13px;

    .time-ago {
        font-size: 12px;
        color: #909399;
        margin-top: 2px;
    }
}

.action-buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.pagination-section {
    display: flex;
    justify-content: center;
}

.text-muted {
    color: #c0c4cc;
    font-style: italic;
}

// 响应式设计
@media (max-width: 768px) {
    .user-management-page {
        padding: 16px;
    }

    .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .table-actions {
        flex-direction: column;
        gap: px;

        .action-right {
            justify-content: flex-start;
        }
    }

    .action-buttons {
        flex-wrap: wrap;
        gap: 8px;
    }
}
</style>