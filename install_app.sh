#!/bin/bash
# 创建桌面快捷方式和 Applications 安装

APP_NAME="Vue AI Chat"
APP_SOURCE="/Users/pla-tony-mbp/Desktop/vueAi/vuwAi/dist/Vue AI Chat.app"
DESKTOP="$HOME/Desktop"
APPLICATIONS="/Applications"

echo "========================================"
echo "  📱 $APP_NAME - 安装快捷方式"
echo "========================================"
echo ""

# 检查应用是否存在
if [ ! -d "$APP_SOURCE" ]; then
    echo "❌ 应用未找到: $APP_SOURCE"
    echo "请先运行: python3 build_app.py"
    exit 1
fi

echo "✅ 找到应用: $APP_SOURCE"
echo ""

# 创建桌面快捷方式
echo "📌 创建桌面快捷方式..."

# macOS 创建快捷方式方法：通过符号链接
ln -sf "$APP_SOURCE" "$DESKTOP/$APP_NAME.app" 2>/dev/null

if [ -L "$DESKTOP/$APP_NAME.app" ]; then
    echo "✅ 桌面快捷方式已创建"
    echo "   位置: $DESKTOP/$APP_NAME.app"
else
    echo "⚠️  快捷方式创建失败（可能需要手动操作）"
fi

echo ""

# 提示安装到 Applications
echo "📱 是否要安装到 Applications 文件夹？(需要密码)"
read -p "   输入 y 确认，其他键跳过: " install_apps

if [ "$install_apps" = "y" ] || [ "$install_apps" = "Y" ]; then
    echo ""
    echo "🔐 将提示输入密码..."
    sudo cp -r "$APP_SOURCE" "$APPLICATIONS/" 2>/dev/null
    
    if [ -d "$APPLICATIONS/$APP_NAME.app" ]; then
        echo "✅ 应用已安装到 Applications"
        echo "   现在可以从 Launchpad 或 Spotlight 启动"
    else
        echo "❌ 安装失败"
    fi
fi

echo ""
echo "========================================"
echo "✨ 完成！"
echo "========================================"
echo ""
echo "📍 你现在可以："
echo "   1. 📱 从桌面快捷方式打开应用"
echo "   2. 🔍 从 Spotlight 搜索 '$APP_NAME'"
echo "   3. 🚀 从 Launchpad 启动应用"
echo ""
echo "🎉 祝你使用愉快！"
