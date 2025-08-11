@echo off
echo ========================================
echo 海洋教育后台管理系统启动脚本
echo ========================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Node.js环境，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js环境检查通过
echo.

echo 正在检查项目依赖...
if not exist "node_modules" (
    echo 未检测到node_modules目录，正在安装依赖...
    echo 这可能需要几分钟时间，请耐心等待...
    npm install
    if %errorlevel% neq 0 (
        echo 依赖安装失败，请检查网络连接或尝试使用yarn
        pause
        exit /b 1
    )
    echo 依赖安装完成
) else (
    echo 依赖检查通过
)

echo.
echo 正在启动开发服务器...
echo 服务器将在 http://localhost:3000 启动
echo 请稍等片刻...
echo.

npm run dev

pause