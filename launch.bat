@echo off
REM Vue AI Chat 启动脚本 (Windows)
REM 给这个文件运行权限后，双击即可启动

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Vue AI Chat - Windows Launcher
echo ========================================
echo.

REM 检查是否已安装 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ❌ 找不到 Node.js。请从 https://nodejs.org 安装
    echo.
    pause
    exit /b 1
)

REM 检查 npm 依赖是否已安装
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    echo.
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo.
        echo ❌ 依赖安装失败
        echo.
        pause
        exit /b 1
    )
)

REM 启动后端服务器
echo 🚀 启动 AI 聊天服务器...
echo.

REM 在新窗口中启动 npm 服务器
start "Vue AI Chat Server" cmd /k npm run server

REM 等待服务器启动
timeout /t 3 /nobreak

REM 打开浏览器
echo 🌐 打开应用在浏览器中...
echo.
start http://localhost:5173

echo.
echo ✅ 应用已启动！
echo 📍 地址: http://localhost:5173
echo 💡 提示: 关闭服务器窗口即可停止应用
echo.
echo ========================================
echo.

REM 保持此窗口打开
pause
