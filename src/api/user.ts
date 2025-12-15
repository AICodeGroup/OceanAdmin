import request from "@/utils/request";

// 用户接口类型定义
export interface User {
    id: number;
    username: string;
    nickname: string;
    phone: string;
    email: string;
    avatar: string;
    gender: number;
    birthday: string;
    province: string;
    city: string;
    district: string;
    address: string;
    points: number;
    level: number;
    status: number;
    lastLoginTime: string;
    createTime: string;
    updateTime: string;
}

export interface UserRelation {
    id: number;
    parentId: number;
    childId: number;
    parentName: string;
    childName: string;
    relation: string;
    createTime: string;
}

export interface UserFootprint {
    id: number;
    userId: number;
    username: string;
    latitude: number;
    longitude: number;
    address: string;
    description: string;
    images: string[];
    createTime: string;
}

// 详细的用户信息，是搭配用户列表用的
export interface UserDetail {
    id: number;
    tagId: string;
    nickname: string;
    avatar: string;
    sex: number;
    birthday: string;
    country: string;
    province: string;
    city: string;
    phone: string;
    status: boolean;
    registerType: string;
    isWechatPublic: boolean;
    isWechatRoutine: boolean;
    isPromoter: boolean;
    mark: string;
    integral: number;
    nowMoney: string;
    createTime: string;
    lastLoginTime: string;
    spreadUid: number;
    spreadName: string | null;
    isLogoff: boolean;
}

//用户列表
export interface UserList {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
    list: UserDetail[];
}

// 获取用户列表
export const getUserList = (params: any) => {
    return request({
        url: "/admin/platform/user/list",
        method: "get",
        params,
    });
};

// 获取用户详情
export const getUserDetail = (id: number) => {
    return request({
        url: `/api/users/${id}`,
        method: "get",
    });
};

// 创建用户
export const createUser = (data: Partial<User>) => {
    return request({
        url: "/api/users",
        method: "post",
        data,
    });
};

// 更新用户信息
export const updateUser = (id: number, data: Partial<User>) => {
    return request({
        url: `/api/users/${id}`,
        method: "put",
        data,
    });
};

// 删除用户
export const deleteUser = (id: number) => {
    return request({
        url: `/api/users/${id}`,
        method: "delete",
    });
};

// 更新用户状态
export const updateUserStatus = (id: number, status: number) => {
    return request({
        url: `/api/users/${id}/status`,
        method: "put",
        data: { status },
    });
};

// 重置用户密码
export const resetUserPassword = (id: number, password: string) => {
    return request({
        url: `/api/users/${id}/password`,
        method: "put",
        data: { password },
    });
};

// 获取用户积分记录
export const getUserPointsHistory = (userId: number, params?: any) => {
    return request({
        url: `/api/users/${userId}/points-history`,
        method: "get",
        params,
    });
};

// 发放用户积分
export const grantUserPoints = (
    userId: number,
    points: number,
    reason: string
) => {
    return request({
        url: `/api/users/${userId}/points`,
        method: "post",
        data: { points, reason },
    });
};

// 扣除用户积分
export const deductUserPoints = (
    userId: number,
    points: number,
    reason: string
) => {
    return request({
        url: `/api/users/${userId}/points/deduct`,
        method: "post",
        data: { points, reason },
    });
};

// 获取用户关系列表
export const getUserRelationList = (params: any) => {
    return request({
        url: "/api/user-relations",
        method: "get",
        params,
    });
};

// 创建用户关系
export const createUserRelation = (data: Partial<UserRelation>) => {
    return request({
        url: "/api/user-relations",
        method: "post",
        data,
    });
};

// 删除用户关系
export const deleteUserRelation = (id: number) => {
    return request({
        url: `/api/user-relations/${id}`,
        method: "delete",
    });
};

// 获取用户足迹列表
export const getUserFootprintList = (params: any) => {
    return request({
        url: "/api/user-footprints",
        method: "get",
        params,
    });
};

// 获取用户足迹详情
export const getUserFootprintDetail = (id: number) => {
    return request({
        url: `/api/user-footprints/${id}`,
        method: "get",
    });
};

// 删除用户足迹
export const deleteUserFootprint = (id: number) => {
    return request({
        url: `/api/user-footprints/${id}`,
        method: "delete",
    });
};

// 获取用户统计数据
export const getUserStats = () => {
    return request({
        url: "/api/users/stats",
        method: "get",
    });
};

// 获取用户等级配置
export const getUserLevelConfig = () => {
    return request({
        url: "/api/user-levels",
        method: "get",
    });
};

// 更新用户等级配置
export const updateUserLevelConfig = (data: any) => {
    return request({
        url: "/api/user-levels",
        method: "put",
        data,
    });
};

// 批量导入用户
export const importUsers = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request({
        url: "/api/users/import",
        method: "post",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// 导出用户数据
export const exportUsers = (params?: any) => {
    return request({
        url: "/api/users/export",
        method: "get",
        params,
        responseType: "blob",
    });
};

// 发送系统消息给用户
export const sendMessageToUser = (
    userId: number,
    title: string,
    content: string
) => {
    return request({
        url: `/api/users/${userId}/message`,
        method: "post",
        data: { title, content },
    });
};

// 批量发送系统消息
export const sendMessageToUsers = (
    userIds: number[],
    title: string,
    content: string
) => {
    return request({
        url: "/api/users/batch-message",
        method: "post",
        data: { userIds, title, content },
    });
};

// ==================== 用户基本操作 ====================

// 获取用户详情（新）
export const getUserDetailById = (id: number) => {
    return request({
        url: `/admin/platform/user/detail/${id}`,
        method: "get",
    });
};

// 修改用户信息（新）
export const updateUserInfo = (data: any) => {
    return request({
        url: "/admin/platform/user/update",
        method: "post",
        data,
    });
};

// 修改用户状态（新）
export const updateUserStatusNew = (params: {
    userId: number;
    status: boolean;
}) => {
    return request({
        url: "/admin/platform/user/status/update",
        method: "post",
        params,
    });
};

// 删除用户（新）
export const deleteUserById = (id: number) => {
    return request({
        url: `/admin/platform/user/${id}`,
        method: "post",
    });
};

// ==================== 用户积分/经验/余额操作 ====================

// 操作用户积分（增加或减少）
export const operateUserIntegral = (data: {
    userId: number;
    operateType: "add" | "sub";
    integral: number;
}) => {
    return request({
        url: "/admin/platform/user/operate/integer",
        method: "post",
        data,
    });
};

// 操作用户经验
export const operateUserExperience = (data: {
    userId: number;
    operateType: "add" | "sub";
    experience: number;
    mark?: string;
}) => {
    return request({
        url: "/admin/platform/user/operate/experience",
        method: "post",
        data,
    });
};

// 操作用户余额
export const operateUserBalance = (params: {
    userId: number;
    operateType: "add" | "sub";
    money: number;
}) => {
    return request({
        url: "/admin/platform/user/operate/balance",
        method: "get",
        params,
    });
};

// ==================== 用户记录查询 ====================

// 用户积分记录
export const getUserIntegralRecord = (params: {
    userId: number;
    page: number;
    limit: number;
    dateLimit?: string;
}) => {
    return request({
        url: "/admin/platform/user/integral/record",
        method: "get",
        params,
    });
};

// 用户经验记录
export const getUserExperienceRecord = (params: {
    userId: number;
    page: number;
    limit: number;
    dateLimit?: string;
}) => {
    return request({
        url: "/admin/platform/user/experience/record",
        method: "get",
        params,
    });
};

// 用户余额记录
export const getUserBalanceRecord = (params: {
    userId: number;
    page: number;
    limit: number;
    dateLimit?: string;
}) => {
    return request({
        url: "/admin/platform/user/balance/record",
        method: "get",
        params,
    });
};

// 用户签到记录
export const getUserSignRecord = (params: {
    userId: number;
    page: number;
    limit: number;
    dateLimit?: string;
}) => {
    return request({
        url: "/admin/platform/user/sign/record",
        method: "get",
        params,
    });
};

// 用户订单列表
export const getUserOrders = (params: {
    userId: number;
    page: number;
    limit: number;
    status?: number;
    dateLimit?: string;
}) => {
    return request({
        url: "/admin/platform/user/orders",
        method: "get",
        params,
    });
};

// 用户观察记录
export const getUserObservations = (params: {
    userId: number;
    page: number;
    limit: number;
    dateLimit?: string;
}) => {
    return request({
        url: "/admin/platform/user/observations",
        method: "get",
        params,
    });
};

// ==================== 用户徽章管理 ====================

// 授予用户徽章
export const addUserBadge = (data: {
    userId: number;
    badgeId: number;
}) => {
    return request({
        url: "/admin/platform/user/addUserBadge",
        method: "post",
        data,
    });
};

// 获取用户徽章记录
export const getUserBadgeHistory = (userId: number) => {
    return request({
        url: `/admin/platform/user/badge-history/${userId}`,
        method: "get",
    });
};

// 删除用户徽章
export const deleteUserBadge = (params: {
    userId: number;
    badgeId: number;
}) => {
    return request({
        url: "/admin/platform/user/deleteUserBadge",
        method: "delete",
        params,
    });
};

// ==================== 用户关系管理 ====================

// 解绑家人关系
export const unbindUserRelation = (data: {
    userId1: number;
    userId2: number;
}) => {
    return request({
        url: "/admin/platform/user/unbindRelation",
        method: "post",
        data,
    });
};

// 用户标签分配
export const assignUserTag = (data: {
    id: number;
    tagId: string;
}) => {
    return request({
        url: "/admin/platform/user/tag",
        method: "post",
        data,
    });
};

// ==================== 会员管理 ====================

// 获取会员卡列表
export const getPaidMemberCardList = () => {
    return request({
        url: "/admin/platform/paid/member/list",
        method: "get",
    });
};

// 赠送付费会员
export const giftPaidMember = (data: {
    ids: number;
    cardId: number;
}) => {
    return request({
        url: "/admin/platform/user/gift/paid/member",
        method: "post",
        data,
    });
};

// ==================== 数据导出 ====================

// 批量导出用户数据（新）
export const exportUserExcel = (params?: any) => {
    return request({
        url: "/admin/platform/export/user/excel",
        method: "get",
        params,
        responseType: "blob",
    });
};

// 导出订单数据
export const exportOrderExcel = (params?: any) => {
    return request({
        url: "/admin/platform/export/order/excel",
        method: "get",
        params,
        responseType: "blob",
    });
};
