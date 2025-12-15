import { defineStore } from "pinia";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { login, logout, getInfo } from "@/api/auth";
import { getToken, setToken, removeToken } from "@/utils/auth";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(getToken());
    const name = ref("");
    const avatar = ref("");
    const roles = ref<string[]>([]);
    const routes = ref<any[]>([
        // {
        //   path: '/dashboard',
        //   name: 'Dashboard',
        //   meta: { title: '仪表盘', icon: 'DataAnalysis', affix: true }
        // },
        // {
        //   path: '/banner',
        //   name: 'Banner',
        //   meta: { title: '轮播图管理', icon: 'Picture' },
        //   children: [
        //     {
        //       path: 'list',
        //       name: 'BannerList',
        //       meta: { title: '轮播图列表', icon: 'List' }
        //     }
        //   ]
        // },
        // {
        //   path: '/course',
        //   name: 'Course',
        //   meta: { title: '课程管理', icon: 'Reading' },
        //   children: [
        //     {
        //       path: 'list',
        //       name: 'CourseList',
        //       meta: { title: '课程列表', icon: 'List' }
        //     },
        //     {
        //       path: 'category',
        //       name: 'CourseCategory',
        //       meta: { title: '课程分类', icon: 'Menu' }
        //     }
        //   ]
        // },
        {
            path: "/dataAnalysis",
            name: "DataAnalysis",
            meta: { title: "数据分析", icon: "TrendCharts" },
            children: [
                {
                    path: "index",
                    name: "DataAnalysisIndex",
                    meta: { title: "数据分析", icon: "TrendCharts" },
                },
            ],
        },
        {
            path: "/growthSystem",
            name: "GrowthSystem",
            meta: { title: "成长体系", icon: "TrophyBase" },
            children: [
                {
                    path: "integralConfig",
                    name: "IntegralConfig",
                    meta: { title: "积分配置", icon: "Coin" },
                },
                {
                    path: "integralRecord",
                    name: "IntegralRecord",
                    meta: { title: "积分记录", icon: "List" },
                },
                {
                    path: "integralAdmin",
                    name: "IntegralAdmin",
                    meta: { title: "积分增减", icon: "Coin" },
                },
                {
                    path: "userLevel",
                    name: "UserLevel",
                    meta: { title: "用户等级", icon: "TrendCharts" },
                },
                {
                    path: "signConfig",
                    name: "SignConfig",
                    meta: { title: "签到配置", icon: "Calendar" },
                },
                {
                    path: "signRecord",
                    name: "SignRecord",
                    meta: { title: "签到记录", icon: "Document" },
                },
                {
                    path: "badge",
                    name: "Badge",
                    meta: { title: "徽章管理", icon: "Medal" },
                    children: [
                        {
                            path: "grant",
                            name: "BadgeGrant",
                            meta: { title: "徽章授予", icon: "Gift" },
                        },
                        {
                            path: "admin",
                            name: "BadgeAdmin",
                            meta: { title: "徽章配置", icon: "Setting" },
                        },
                                         {
                        path: "type",
                        name: "BadgeType",
                        component: () =>
                            import("@/pages/newBadge/badgeType.vue"),
                        meta: { title: "徽章分类", icon: "Folder" },
                    },
                    ],
                },
                {
                    path: "ranking",
                    name: "Ranking",
                    meta: { title: "排行榜", icon: "TrophyBase" },
                },
            ],
        },
        {
            path: "/newUserInfo",
            name: "newUserInfo",
            meta: { title: "用户管理", icon: "User" },
            children: [
                {
                    path: "userList",
                    name: "userList",
                    meta: { title: "用户列表", icon: "UserFilled" },
                },
                {
                    path: "familyRelationship",
                    name: "familyRelationship",
                    meta: { title: "家人绑定管理", icon: "Link" },
                },
                // {
                //     path: "userEnrollList",
                //     name: "userEnrollList",
                //     meta: { title: "用户报名列表", icon: "UserFilled" },
                // },
            ],
        },

        {
            path: "/newCourse",
            name: "newCourse",
            meta: { title: "课程管理", icon: "Reading", affix: true },
            children: [
                {
                    path: "newCourseList",
                    name: "newCourseList",
                    meta: { title: "课程列表", icon: "List" },
                },
                {
                    path: "newBannerList",
                    name: "newBannerList",
                    meta: { title: "轮播图列表", icon: "Picture" },
                },
            ],
        },
        // {
        //   path: '/order',
        //   name: 'Order',
        //   meta: { title: '订单管理', icon: 'ShoppingCart' },
        //   children: [
        //     {
        //       path: 'list',
        //       name: 'OrderList',
        //       meta: { title: '订单列表', icon: 'List' }
        //     }
        //   ]
        // },
        // {
        //   path: '/user',
        //   name: 'User',
        //   meta: { title: '用户管理', icon: 'User' },
        //   children: [
        //     {
        //       path: 'list',
        //       name: 'UserList',
        //       meta: { title: '用户列表', icon: 'UserFilled' }
        //     }
        //   ]
        // },
        // {
        //   path: '/integral',
        //   name: 'Integral',
        //   meta: { title: '积分管理', icon: 'Coin' },
        //   children: [
        //     {
        //       path: 'rules',
        //       name: 'IntegralRules',
        //       meta: { title: '积分规则', icon: 'Setting' }
        //     },
        //     {
        //       path: 'tasks',
        //       name: 'IntegralTasks',
        //       meta: { title: '积分任务', icon: 'List' }
        //     },
        //     {
        //       path: 'mall',
        //       name: 'IntegralMall',
        //       meta: { title: '积分商城', icon: 'ShoppingBag' }
        //     },
        //     {
        //       path: 'records',
        //       name: 'IntegralRecords',
        //       meta: { title: '积分记录', icon: 'Document' }
        //     }
        //   ]
        // },
        // {
        //   path: '/schedule',
        //   name: 'Schedule',
        //   meta: { title: '日程管理', icon: 'Calendar' },
        //   children: [
        //     {
        //       path: 'list',
        //       name: 'ScheduleList',
        //       meta: { title: '日程列表', icon: 'List' }
        //     }
        //   ]
        // },
        // {
        //   path: '/footprint',
        //   name: 'Footprint',
        //   meta: { title: '足迹管理', icon: 'Location' },
        //   children: [
        //     {
        //       path: 'list',
        //       name: 'FootprintList',
        //       meta: { title: '足迹列表', icon: 'List' }
        //     }
        //   ]
        // },
        // {
        //   path: '/content',
        //   name: 'Content',
        //   meta: { title: '内容审核', icon: 'Document' },
        //   children: [
        //     {
        //       path: 'audit',
        //       name: 'ContentAudit',
        //       meta: { title: '内容审核', icon: 'View' }
        //     }
        //   ]
        // },
        // {
        //   path: '/badge',
        //   name: 'Badge',
        //   meta: { title: '徽章管理', icon: 'Medal' },
        //   children: [
        //     {
        //       path: 'list',
        //       name: 'BadgeList',
        //       meta: { title: '徽章列表', icon: 'List' }
        //     }
        //   ]
        // },
        // {
        //     path: "/newBadge",
        //     name: "newBadge",
        //     meta: { title: "徽章管理", icon: "Medal" },
        //     children: [
        //         {
        //             path: "list",
        //             name: "newBadgeList",
        //             meta: { title: "徽章授予", icon: "List" },
        //         },
        //         {
        //             path: "badgeAdmin",
        //             name: "badgeAdmin",
        //             meta: { title: "徽章管理", icon: "List" },
        //         },
        //     ],
        // },
        // {
        //   path: '/species',
        //   name: 'Species',
        //   meta: { title: '物种管理', icon: 'Cherry' },
        //   children: [
        //     {
        //       path: 'list',
        //       name: 'SpeciesList',
        //       meta: { title: '物种列表', icon: 'List' }
        //     }
        //   ]
        // },
        // {
        //   path: '/statistics',
        //   name: 'Statistics',
        //   meta: { title: '数据统计', icon: 'DataAnalysis' },
        //   children: [
        //     {
        //       path: 'overview',
        //       name: 'StatisticsOverview',
        //       meta: { title: '数据概览', icon: 'DataBoard' }
        //     }
        //   ]
        // },
        // {
        //   path: '/system',
        //   name: 'System',
        //   meta: { title: '系统配置', icon: 'Setting' },
        //   children: [
        //     {
        //       path: 'config',
        //       name: 'SystemConfig',
        //       meta: { title: '系统配置', icon: 'Tools' }
        //     }
        //   ]
        // },
        {
            path: "/task",
            name: "task",
            meta: { title: "日常任务管理", icon: "Calendar", hidden: true },
            children: [
                {
                    path: "list",
                    name: "TaskList",
                    meta: { title: "日常任务列表", icon: "List" },
                },
            ],
        },
        {
            path: "/newOrder",
            name: "newOrder",
            meta: { title: "订单管理", icon: "ShoppingCart" },
            children: [
                {
                    path: "orderStatistics",
                    name: "orderStatistics",
                    meta: { title: "订单统计", icon: "DataAnalysis" },
                },
                {
                    path: "courseOrderList",
                    name: "courseOrderList",
                    meta: { title: "课程订单", icon: "Reading" },
                },
                {
                    path: "entityOrderList",
                    name: "entityOrderList",
                    meta: { title: "实体商品订单", icon: "ShoppingBag" },
                },
                // {
                //     path: "orderList",
                //     name: "orderList",
                //     meta: { title: "订单列表（旧）", icon: "DocumentCopy" },
                // },
            ],
        },
        {
            path: "/observe",
            name: "Observe",
            meta: { title: "审核观察记录", icon: "Reading" },
            children: [
                {
                    path: "judgeObserve",
                    name: "judgeObserve",
                    meta: { title: "审核观察记录", icon: "List" },
                },
                {
                    path: "observeList",
                    name: "observeList",
                    meta: { title: "观察记录列表", icon: "Menu" },
                },
            ],
        },
        {
            path: "/species",
            name: "Species",
            meta: { title: "物种管理", icon: "Cherry" },
            children: [
                {
                    path: "list",
                    name: "SpeciesList",
                    meta: { title: "物种列表", icon: "List" },
                },
                {
                    path: "category",
                    name: "SpeciesCategory",
                    meta: { title: "物种分类", icon: "Menu" },
                },
                {
                    path: "course-relation",
                    name: "SpeciesCourseRelation",
                    meta: { title: "课程关联", icon: "Link" },
                },
            ],
        },
        {
            path: "/newArticle",
            name: "newArticle",
            meta: { title: "文章管理", icon: "Management" },
            children: [
                {
                    path: "articleList",
                    name: "articleList",
                    meta: { title: "文章列表", icon: "List" },
                },
                {
                    path: "categoryList",
                    name: "articleCategoryList",
                    meta: { title: "文章分类", icon: "Menu" },
                },
                {
                    path: "bannerList",
                    name: "articleBannerList",
                    meta: { title: "轮播图管理", icon: "Picture" },
                },
            ],
        },
        {
            path: "/product",
            name: "product",
            meta: { title: "商品管理", icon: "ShoppingBag" },
            children: [
                {
                    path: "productList",
                    name: "productList",
                    meta: { title: "商品列表", icon: "List" },
                },
                {
                    path: "categoryList",
                    name: "productCategoryList",
                    meta: { title: "商品分类", icon: "Menu" },
                },
            ],
        },
        {
            path: "/websiteConfig",
            name: "WebsiteConfig",
            meta: { title: "网站配置", icon: "Monitor" },
            children: [
                {
                    path: "contactInfo",
                    name: "ContactInfo",
                    meta: { title: "联系方式管理", icon: "Phone" },
                },
                {
                    path: "consultation",
                    name: "Consultation",
                    meta: { title: "在线咨询管理", icon: "ChatDotRound" },
                },
            ],
        },
        {
            path: "/system",
            name: "System",
            meta: { title: "系统配置", icon: "Setting", hidden: true },
            children: [
                {
                    path: "config",
                    name: "SystemConfig",
                    meta: { title: "系统配置", icon: "Tools" },
                },
            ],
        },
    
        {
            path: "/sensitiveLog",
            name: "SensitiveLogRoot",
            meta: { title: "敏感操作日志", icon: "List" },
            children: [
                {
                    path: "index",
                    name: "SensitiveLog",
                    meta: { title: "敏感操作日志", icon: "List" },
                },
            ],
        },
    ]);
    const userInfo = ref({
        name: "",
        avatar: "",
        roles: [],
    });

    // 登录
    const loginAction = async (loginForm: any) => {
        try {
            const res = await login(loginForm);
            console.log(res);
            if (res) {
                token.value = res.token;
                setToken(res.token);
                return Promise.resolve();
            } else {
                return Promise.reject(new Error(data.message || "登录失败"));
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };

    // 获取用户信息
    const getUserInfoAction = async () => {
        try {
            // 临时模拟用户信息，避免后端连接错误
            // const { data } = await getInfo()
            // name.value = data.name
            // avatar.value = data.avatar
            // roles.value = data.roles

            // 模拟用户信息
            name.value = "Admin";
            avatar.value =
                "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
            roles.value = ["admin"];

            // 更新 userInfo
            userInfo.value = {
                name: name.value,
                avatar: avatar.value,
                roles: roles.value,
            };

            return Promise.resolve({
                name: name.value,
                avatar: avatar.value,
                roles: roles.value,
            });
        } catch (error) {
            return Promise.reject(error);
        }
    };

    // 登出
    const logoutAction = async () => {
        try {
            // 临时跳过后端登出请求，避免后端连接错误
            // await logout()
            console.log(logout);
            token.value = "";
            name.value = "";
            avatar.value = "";
            roles.value = [];
            userInfo.value = {
                name: "",
                avatar: "",
                roles: [],
            };
            removeToken();
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    };

    // 重置token
    const resetToken = () => {
        token.value = "";
        name.value = "";
        avatar.value = "";
        roles.value = [];
        userInfo.value = {
            name: "",
            avatar: "",
            roles: [],
        };
        removeToken();
    };

    return {
        token,
        name,
        avatar,
        roles,
        routes,
        userInfo,
        login: loginAction,
        getUserInfo: getUserInfoAction,
        logout: logoutAction,
        resetToken,
    };
});
