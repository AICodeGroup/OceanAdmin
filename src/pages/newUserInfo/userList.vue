<template>
    <div class="user-management-page">
        <!-- 页面标题 -->
        <div class="page-header">
            <div class="header-left">
                <el-icon class="header-icon" :size="20">
                    <User />
                </el-icon>
                <h1 class="page-title">用户管理</h1>
            </div>
            <div class="header-actions">
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
                            <el-form-item label="用户等级">
                                <el-select v-model="searchForm.levelId" placeholder="全部等级" clearable style="width: 100%">
                                    <el-option 
                                        v-for="level in levelList" 
                                        :key="level.id" 
                                        :label="level.name" 
                                        :value="level.id" 
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="账号状态">
                                <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 100%">
                                    <el-option label="正常" :value="true" />
                                    <el-option label="禁用" :value="false" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="会员类型">
                                <el-select v-model="searchForm.isPaidMember" placeholder="全部" clearable style="width: 100%">
                                    <el-option label="付费会员" :value="true" />
                                    <el-option label="普通用户" :value="false" />
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
                                        <span class="username">{{ row.nickname }}</span>
                                    </div>
                                    <div class="user-nickname">标签ID: {{ row.tagId }}</div>
                                    <div class="user-id">ID: {{ row.id }}</div>
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
                                    <span>{{ formatMobile(row.phone) }}</span>
                                </div>
                                <div class="contact-item">
                                    <span>性别: {{ getSexText(row.sex) }}</span>
                                </div>
                                <div class="contact-item" v-if="row.city">
                                    <el-icon>
                                        <Location />
                                    </el-icon>
                                    <span>{{ formatLocation(row) }}</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 注册来源列 -->
                    <el-table-column label="注册来源" width="120" align="center">
                        <template #default="{ row }">
                            <el-tag :type="getRegisterTypeColor(row.registerType)" size="small">
                                {{ getRegisterTypeText(row.registerType) }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <!-- 状态信息列 -->
                    <el-table-column label="状态" width="120" align="center">
                        <template #default="{ row }">
                            <el-tag :type="row.status ? 'success' : 'danger'">
                                {{ row.status ? '正常' : '禁用' }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <!-- 积分列 -->
                    <el-table-column label="积分" width="100" align="center">
                        <template #default="{ row }">
                            <div style="font-weight: 500; color: #409EFF;">
                                {{ row.integral }}
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 时间信息列 -->
                    <el-table-column label="注册时间" width="160" sortable prop="createTime">
                        <template #default="{ row }">
                            <div class="time-info">
                                <div>{{ formatTime(row.createTime) }}</div>
                                <div class="time-ago">{{ getTimeAgo(row.createTime) }}</div>
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



                                <el-dropdown @command="(command: string) => handleCommand(command, row)">
                                    <el-button size="small" text>
                                        <el-icon>
                                            <MoreFilled />
                                        </el-icon>
                                        更多
                                    </el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item command="integral">
                                                操作积分
                                            </el-dropdown-item>
                                            <el-dropdown-item command="experience">
                                                操作经验
                                            </el-dropdown-item>
                                            <!-- <el-dropdown-item command="balance">
                                                操作余额
                                            </el-dropdown-item> -->
                                            <el-dropdown-item command="member" divided>
                                                赠送会员
                                            </el-dropdown-item>
                                            <el-dropdown-item command="enable" v-if="!row.status" divided>
                                                启用账号
                                            </el-dropdown-item>
                                            <el-dropdown-item command="disable" v-if="row.status" divided>
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
        <UserDetailDialog v-model="detailDialogVisible" :user-id="currentUserId" />

        <!-- 用户编辑对话框 -->
        <UserEditDialog v-model="editDialogVisible" :user-info="currentUser" @success="handleRefresh" />

        <!-- 用户操作对话框（积分/经验/余额） -->
        <UserOperateDialog 
            v-model="operateDialogVisible" 
            :user-id="currentUserId" 
            :operate-type="operateType"
            @success="handleRefresh" 
        />

        <!-- 赠送会员对话框 -->
        <GiftMemberDialog v-model="memberDialogVisible" :user-info="currentUser" @success="handleRefresh" />

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
    View, Edit, Key, MoreFilled, User
} from '@element-plus/icons-vue';

// 组件引入
import UserDetailDialog from '@/components/user/UserDetailDialog.vue';
import UserEditDialog from '@/components/user/UserEditDialog.vue';
import UserOperateDialog from '@/components/user/UserOperateDialog.vue';
import GiftMemberDialog from '@/components/user/GiftMemberDialog.vue';
import ResetPasswordDialog from '@/components/userSetting/resetPasswordDialog.vue';
import { 
    getUserList, 
    updateUserStatusNew, 
    deleteUserById, 
    UserDetail, 
    UserList 
} from '@/api/user';
import { getUserLevelList } from '@/api/growthSystem';
import { exportUsers } from '@/utils/export';

// 使用API定义的类型
type User = UserDetail;

interface SearchForm {
    keyword: string;
    status?: boolean;
    levelId?: number;
    isPaidMember?: boolean;
    registerTime: string[];
    lastLoginTime: string[];
    dateLimit?: string;
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
const levelList = ref<any[]>([]);
const detailDialogVisible = ref(false);
const editDialogVisible = ref(false);
const operateDialogVisible = ref(false);
const memberDialogVisible = ref(false);
const resetPasswordDialogVisible = ref(false);
const currentUserId = ref(0);
const currentUser = ref<User | null>(null);
const operateType = ref<'integral' | 'experience' | 'balance'>('integral');

const searchForm = reactive<SearchForm>({
    keyword: '',
    status: undefined,
    levelId: undefined,
    isPaidMember: undefined,
    registerTime: [],
    lastLoginTime: [],
    dateLimit: ''
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
    loadLevelList();
});

// 加载等级列表
const loadLevelList = async () => {
    try {
        const data = await getUserLevelList();
        levelList.value = data || [];
    } catch (error) {
        console.error('加载等级列表失败:', error);
    }
};

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

const handleSearch = () => {
    pagination.current = 1;
    loadUserList();
};

const handleReset = () => {
    Object.assign(searchForm, {
        keyword: '',
        status: undefined,
        levelId: undefined,
        isPaidMember: undefined,
        registerTime: [],
        lastLoginTime: [],
        dateLimit: ''
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
    currentUserId.value = user.id;
    detailDialogVisible.value = true;
};

const handleEdit = (user: User) => {
    currentUser.value = user;
    editDialogVisible.value = true;
};

const handleResetPassword = (user: User) => {
    currentUser.value = user;
    resetPasswordDialogVisible.value = true;
};

const handleAddUser = () => {
    ElMessage.info('打开新增用户对话框');
};

const handleExport = async () => {
    console.log('=== 开始导出 ===');
    try {
        loading.value = true;
        
        // 构建导出参数
        const params: any = {
            keywords: searchForm.keyword || undefined,
            status: searchForm.status,
            levelId: searchForm.levelId,
            isPaidMember: searchForm.isPaidMember,
            dateLimit: searchForm.dateLimit || undefined,
        };

        console.log('导出参数:', params);

        // 使用通用导出工具函数
        console.log('准备调用 exportUsers');
        const result = await exportUsers(params);
        console.log('导出完成:', result);
        
        ElMessage.success('导出成功');
    } catch (error) {
        console.error('导出失败:', error);
        ElMessage.error('导出失败');
    } finally {
        loading.value = false;
        console.log('=== 导出结束 ===');
    }
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
    currentUserId.value = user.id;
    currentUser.value = user;
    
    switch (command) {
        case 'integral':
            operateType.value = 'integral';
            operateDialogVisible.value = true;
            break;
        case 'experience':
            operateType.value = 'experience';
            operateDialogVisible.value = true;
            break;
        case 'balance':
            operateType.value = 'balance';
            operateDialogVisible.value = true;
            break;
        case 'member':
            memberDialogVisible.value = true;
            break;
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
            `确定要启用用户 "${user.nickname}" 吗？`,
            '提示',
            { type: 'warning' }
        );
        await updateUserStatusNew({ userId: user.id, status: true });
        ElMessage.success('启用成功');
        loadUserList();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('启用失败:', error);
            ElMessage.error('启用失败');
        }
    }
};

const handleDisableUser = async (user: User) => {
    try {
        await ElMessageBox.confirm(
            `确定要禁用用户 "${user.nickname}" 吗？`,
            '提示',
            { type: 'warning' }
        );
        await updateUserStatusNew({ userId: user.id, status: false });
        ElMessage.success('禁用成功');
        loadUserList();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('禁用失败:', error);
            ElMessage.error('禁用失败');
        }
    }
};

const handleDeleteUser = async (user: User) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除用户 "${user.nickname}" 吗？此操作不可恢复！`,
            '警告',
            { type: 'error' }
        );
        await deleteUserById(user.id);
        ElMessage.success('删除成功');
        loadUserList();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('删除失败:', error);
            ElMessage.error('删除失败');
        }
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

const getSexText = (sex: number) => {
    const sexMap: { [key: number]: string } = {
        0: '未知',
        1: '男',
        2: '女'
    };
    return sexMap[sex] || '未知';
};

const formatLocation = (user: User) => {
    const parts = [user.country, user.province, user.city].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : '-';
};

const formatTime = (time: string) => {
    return dayjs(time).format('YYYY-MM-DD HH:mm');
};

const getTimeAgo = (time: string) => {
    return dayjs(time).fromNow();
};

const getRegisterTypeText = (registerType: string) => {
    const registerTypeMap: { [key: string]: string } = {
        'public': '公众号',
        'routine': '小程序',
        'H5': 'H5',
        'iosWx': '微信iOS',
        'androidWx': '微信安卓',
        'ios': 'iOS'
    };
    return registerTypeMap[registerType] || '未知';
};

const getRegisterTypeColor = (registerType: string) => {
    const colorMap: { [key: string]: string } = {
        'public': 'success',
        'routine': 'primary',
        'H5': 'warning',
        'iosWx': 'info',
        'androidWx': 'info',
        'ios': ''
    };
    return colorMap[registerType] || 'info';
};

// 实际API 请求
const apiGetUsers = async (): Promise<{ data: UserList }> => {
    // 构建请求参数
    const params: any = {
        page: pagination.current,
        limit: pagination.size,
        keywords: searchForm.keyword || undefined,
        status: searchForm.status,
        levelId: searchForm.levelId,
        isPaidMember: searchForm.isPaidMember,
        dateLimit: searchForm.dateLimit || undefined,
    };

    // 实际API调用
    const response = await getUserList(params) as unknown as UserList;
    return { data: response };
};

</script>

<style lang="scss" scoped>
.user-management-page {
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
            color: #909399;
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
        gap: 12px;

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