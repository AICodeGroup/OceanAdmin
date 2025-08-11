# 海洋教育后台管理系统

基于 Vue 3 + TypeScript + Element Plus 构建的海洋教育后台管理系统前端项目。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI框架**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **图表库**: ECharts
- **富文本编辑器**: WangEditor
- **样式**: SCSS + CSS变量
- **日期处理**: Day.js

## 功能模块

### 核心功能
- 🔐 登录认证模块
- 📊 仪表盘/数据概览
- 🖼️ 轮播图管理
- 📚 课程管理
- 📋 订单管理
- 👥 用户管理
- 🏆 积分管理
- 📅 日程管理
- 📍 足迹管理
- 🔍 内容审核
- 🏅 徽章系统管理
- 🐠 物种图鉴管理
- 📈 数据统计
- ⚙️ 系统配置

### 特色功能
- 响应式设计，支持移动端
- 权限控制系统
- 多标签页导航
- 全屏功能
- 面包屑导航
- 搜索功能
- 图表数据可视化

## 项目结构

```
ocean-admin/
├── src/
│   ├── api/               # API接口
│   ├── components/        # 公共组件
│   ├── layout/           # 布局组件
│   ├── pages/            # 页面组件
│   ├── router/           # 路由配置
│   ├── stores/           # 状态管理
│   ├── styles/           # 样式文件
│   ├── utils/            # 工具函数
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── public/               # 静态资源
├── index.html           # HTML模板
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript配置
├── vite.config.ts       # Vite配置
└── README.md           # 项目说明
```

## 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产构建
```bash
npm run preview
# 或
yarn preview
```

## 配置说明

### 环境变量
项目使用 `.env` 文件进行环境配置：

```env
# 应用配置
VITE_APP_TITLE=海洋教育后台管理系统
VITE_APP_BASE_API=/api

# 开发环境配置
VITE_API_BASE_URL=http://localhost:8080/api
VITE_UPLOAD_URL=http://localhost:8080/api/upload
```

### 代理配置
开发环境下，API请求会通过Vite代理转发到后端服务：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 使用说明

### 登录
- 默认用户名: `admin`
- 默认密码: `123456`

### 权限系统
系统采用RBAC权限控制，支持：
- 角色管理
- 菜单权限
- 按钮权限
- 数据权限

### 组件使用
项目已配置自动导入，Element Plus组件可直接使用：

```vue
<template>
  <el-button type="primary">按钮</el-button>
</template>
```

### API调用
使用封装的request工具进行API调用：

```typescript
import request from '@/utils/request'

export function getUserList(params: any) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}
```

## 开发规范

### 代码风格
- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 规范
- 使用 ESLint 进行代码检查

### 命名规范
- 文件名：kebab-case
- 组件名：PascalCase
- 变量名：camelCase
- 常量名：UPPER_SNAKE_CASE

### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 部署说明

### 构建
```bash
npm run build
```

### 部署
将 `dist` 目录下的文件部署到Web服务器即可。

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 常见问题

### 1. 安装依赖失败
```bash
# 清除缓存后重新安装
npm cache clean --force
npm install
```

### 2. 开发服务器启动失败
检查端口是否被占用，或修改 `vite.config.ts` 中的端口配置。

### 3. API请求失败
检查后端服务是否启动，以及代理配置是否正确。

## 更新日志

### v1.0.0 (2024-01-31)
- 🎉 项目初始化
- ✨ 完成基础框架搭建
- ✨ 实现登录认证功能
- ✨ 完成仪表盘页面
- ✨ 实现轮播图管理
- ✨ 实现课程管理基础功能
- ✨ 实现用户管理基础功能

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目地址: [https://github.com/ocean-education/ocean-admin](https://github.com/ocean-education/ocean-admin)
- 问题反馈: [Issues](https://github.com/ocean-education/ocean-admin/issues)

---

© 2024 海洋教育团队. All rights reserved.