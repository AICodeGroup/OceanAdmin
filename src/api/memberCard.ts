import request from "@/utils/request";

// 获取会员卡列表（带查询参数）
export const getMemberCardList = (params?: {
    name?: string;
    type?: number;
    status?: boolean;
}) => {
    return request({
        url: "/admin/platform/paid/member/list",
        method: "get",
        params,
    });
};

// 添加会员卡
export const addMemberCard = (data: {
    name: string;
    label?: string;
    type: number;
    deadlineDay?: number;
    originalPrice: number;
    price: number;
    isFirstChargeGive: boolean;
    giftBalance: number;
    sort: number;
    status: boolean;
}) => {
    return request({
        url: "/admin/platform/paid/member/card/add",
        method: "post",
        data,
    });
};

// 编辑会员卡
export const editMemberCard = (data: {
    id: number;
    name: string;
    label?: string;
    type: number;
    deadlineDay?: number;
    originalPrice: number;
    price: number;
    isFirstChargeGive: boolean;
    giftBalance: number;
    sort: number;
    status: boolean;
}) => {
    return request({
        url: "/admin/platform/paid/member/card/edit",
        method: "post",
        data,
    });
};

// 会员卡开关
export const switchMemberCard = (id: number) => {
    return request({
        url: `/admin/platform/paid/member/card/switch/${id}`,
        method: "post",
    });
};

// 删除会员卡
export const deleteMemberCard = (id: number) => {
    return request({
        url: `/admin/platform/paid/member/card/delete/${id}`,
        method: "post",
    });
};
