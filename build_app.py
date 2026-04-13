#!/usr/bin/env python3
"""
Vue AI Chat - 一键打包为桌面应用 (.app for macOS, .exe for Windows)
"""

import os
import sys
import subprocess
import shutil
import json

def check_dependencies():
    """检查必要的依赖"""
    print("检查依赖...")
    
    # 检查 PyInstaller
    try:
        import PyInstaller
        print("✅ PyInstaller 已安装")
    except ImportError:
        print("❌ 需要安装 PyInstaller")
        print("  运行: pip3 install pyinstaller")
        return False
    
    return True

def build_app():
    """打包应用"""
    
    project_root = os.path.dirname(os.path.abspath(__file__))
    icon_path = os.path.join(project_root, 'assets', 'icon.png')
    icon_ico = os.path.join(project_root, 'assets', 'icon.ico')
    launcher_path = os.path.join(project_root, 'launch.py')
    
    print("\n" + "="*60)
    print("  🎨 Vue AI Chat - 应用打包工具")
    print("="*60)
    
    # 检查图标
    if not os.path.exists(icon_path):
        print("⚠️  图标未找到，生成默认图标...")
        subprocess.run(['python3', 'create_icon.py'], cwd=project_root)
    
    # 确定操作系统
    system = sys.platform
    is_mac = system == 'darwin'
    is_windows = system == 'win32' or system == 'cygwin'
    is_linux = system.startswith('linux')
    
    print(f"\n📱 检测到系统: {'macOS' if is_mac else 'Windows' if is_windows else 'Linux'}")
    
    # PyInstaller 参数
    pyinstaller_args = [
        sys.executable, '-m', 'PyInstaller',
        '--onefile',           # 单文件
        '--windowed',          # 无控制台窗口
        '--name=Vue AI Chat',  # 应用名称
        '--add-data', f'{os.path.join(project_root, "assets")}:assets',  # 包含 assets
    ]
    
    # 添加图标
    if is_mac and os.path.exists(icon_path):
        pyinstaller_args.extend(['--icon', icon_path])
    elif is_windows and os.path.exists(icon_ico):
        pyinstaller_args.extend(['--icon', icon_ico])
    
    # 添加启动脚本
    pyinstaller_args.append(launcher_path)
    
    print(f"\n🔨 正在打包应用...")
    print(f"   命令: {' '.join(pyinstaller_args)}\n")
    
    result = subprocess.run(pyinstaller_args, cwd=project_root)
    
    if result.returncode != 0:
        print("\n❌ 打包失败")
        return False
    
    # 显示输出位置
    if is_mac:
        app_path = os.path.join(project_root, 'dist', 'Vue AI Chat.app')
        print(f"\n✅ macOS 应用已生成!")
        print(f"   位置: {app_path}")
        print(f"\n📍 如何使用:")
        print(f"   1. 打开 Finder，进入: dist/ 目录")
        print(f"   2. 找到 'Vue AI Chat.app'")
        print(f"   3. 右键 → 打开 (第一次需要)")
        print(f"   4. 或拖到 Applications 文件夹")
        print(f"\n💡 之后可以从 Launchpad 或 Applications 中启动")
    
    elif is_windows:
        exe_path = os.path.join(project_root, 'dist', 'Vue AI Chat.exe')
        print(f"\n✅ Windows 应用已生成!")
        print(f"   位置: {exe_path}")
        print(f"\n📍 如何使用:")
        print(f"   1. 双击 dist/Vue AI Chat.exe 即可运行")
        print(f"   2. 或右键创建快捷方式放到桌面")
    
    else:
        binary_path = os.path.join(project_root, 'dist', 'Vue AI Chat')
        print(f"\n✅ Linux 应用已生成!")
        print(f"   位置: {binary_path}")
        print(f"   运行: ./dist/'Vue AI Chat'")
    
    return True

def cleanup():
    """清理临时文件"""
    project_root = os.path.dirname(os.path.abspath(__file__))
    
    # 删除构建缓存
    build_dirs = ['build', '__pycache__']
    for d in build_dirs:
        dir_path = os.path.join(project_root, d)
        if os.path.exists(dir_path):
            shutil.rmtree(dir_path)
            print(f"清理: {d}")

if __name__ == '__main__':
    print("\n🚀 Vue AI Chat - 应用打包")
    print("="*60 + "\n")
    
    # 检查依赖
    if not check_dependencies():
        print("\n请先安装依赖:")
        print("  pip3 install pyinstaller")
        sys.exit(1)
    
    # 打包应用
    if build_app():
        print("\n" + "="*60)
        print("✨ 打包完成!")
        print("="*60 + "\n")
    else:
        sys.exit(1)
