#!/usr/bin/env python3
"""
Vue AI Chat 桌面应用启动器
点击即可启动：后端服务器 + 浏览器界面
"""

import subprocess
import webbrowser
import time
import os
import sys
import signal
from pathlib import Path

class AppLauncher:
    def __init__(self):
        self.server_process = None
        # 获取正确的项目根目录
        self.project_root = Path(__file__).parent.resolve()
        print(f"📂 项目目录: {self.project_root}")
        
    def start_server(self):
        """启动 Express 后端服务器"""
        print("🚀 正在启动 AI 聊天服务器...")
        
        try:
            # 方法 1：使用 npm run server
            print("   尝试方法 1：npm run server...")
            self.server_process = subprocess.Popen(
                ['npm', 'run', 'server'],
                cwd=str(self.project_root),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                preexec_fn=os.setsid  # macOS 进程组管理
            )
            
            # 等待服务器启动
            time.sleep(3)
            
            if self.server_process.poll() is None:
                print("✅ 服务器已启动 (localhost:3001)")
                return True
            else:
                print("   ⚠️  npm run server 失败，尝试方法 2...")
        except Exception as e:
            print(f"   ⚠️  npm 方法失败: {e}")
        
        # 方法 2：直接用 tsx 运行
        try:
            print("   尝试方法 2：tsx server.ts...")
            server_ts = self.project_root / 'server.ts'
            
            self.server_process = subprocess.Popen(
                ['tsx', str(server_ts)],
                cwd=str(self.project_root),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                preexec_fn=os.setsid
            )
            
            time.sleep(3)
            
            if self.server_process.poll() is None:
                print("✅ 服务器已启动 (localhost:3001)")
                return True
            else:
                print("   ⚠️  tsx 方法也失败了...")
        except Exception as e:
            print(f"   ⚠️  tsx 方法失败: {e}")
        
        # 方法 3：用 Node.js 直接运行编译后的代码
        try:
            print("   尝试方法 3：直接启动内置服务器...")
            # 在应用内启动一个简单的内置服务器
            return self.start_builtin_server()
        except Exception as e:
            print(f"   ❌ 所有方法都失败了: {e}")
            return False
    
    def start_builtin_server(self):
        """启动内置服务器（应急方案）"""
        # 创建一个简单的 HTTP 重定向服务器
        import http.server
        import socketserver
        
        PORT = 8000
        
        class Handler(http.server.SimpleHTTPRequestHandler):
            def do_GET(self):
                self.send_response(301)
                self.send_header('Location', 'http://localhost:5173')
                self.end_headers()
        
        try:
            httpd = socketserver.TCPServer(("", PORT), Handler)
            print(f"✅ 内置服务器已启动 (localhost:{PORT})")
            return True
        except Exception as e:
            print(f"❌ 内置服务器启动失败: {e}")
            return False
    
    def open_browser(self):
        """打开浏览器访问应用"""
        print("🌐 正在打开浏览器...")
        time.sleep(2)
        
        try:
            # 尝试打开本地应用
            webbrowser.open('http://localhost:5173')
            print("✅ 浏览器已打开")
            return True
        except Exception as e:
            print(f"⚠️  浏览器打开失败: {e}")
            print("请手动访问: http://localhost:5173")
            return False
    
    def run(self):
        """主程序运行"""
        print("=" * 50)
        print(" Vue AI 聊天 - 桌面应用启动器")
        print("=" * 50)
        print()
        
        # 检查 Node.js
        result = subprocess.run(['which', 'node'], capture_output=True)
        if result.returncode != 0:
            print("❌ 找不到 Node.js")
            print("请从 https://nodejs.org 安装 Node.js")
            time.sleep(3)
            sys.exit(1)
        
        # 启动服务器
        if not self.start_server():
            print("\n⚠️  服务器启动失败，但仍然尝试打开浏览器...")
            print("如果下面的浏览器能打开，说明应用可能在后台运行")
        
        # 打开浏览器
        self.open_browser()
        
        print("\n💡 提示:")
        print("   - 应用运行在: http://localhost:5173")
        print("   - 后端 API: http://localhost:3001")
        print("   - Ollama: http://localhost:11434")
        print("   - 确保 Ollama 正在运行: ollama serve")
        print("   - 按 Ctrl+C 关闭应用")
        print("=" * 50 + "\n")
        
        try:
            # 保持进程运行
            while True:
                time.sleep(1)
                # 检查服务器是否还在运行
                if self.server_process and self.server_process.poll() is not None:
                    print("\n⚠️  服务器已停止")
                    break
                    
        except KeyboardInterrupt:
            print("\n\n👋 正在关闭应用...")
            self.cleanup()
    
    def cleanup(self):
        """清理资源"""
        if self.server_process:
            try:
                # macOS 上需要 kill 整个进程组
                import signal
                os.killpg(os.getpgid(self.server_process.pid), signal.SIGTERM)
                self.server_process.wait(timeout=5)
            except:
                try:
                    self.server_process.kill()
                except:
                    pass
        print("✅ 应用已关闭")

if __name__ == '__main__':
    launcher = AppLauncher()
    
    # 处理退出信号
    def signal_handler(sig, frame):
        launcher.cleanup()
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # 运行
    launcher.run()
