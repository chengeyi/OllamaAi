#!/usr/bin/env python3
"""
生成 Vue AI Chat 应用图标
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon():
    """创建应用图标"""
    
    # 创建 512x512 图像（渐变背景）
    img = Image.new('RGB', (512, 512), color=(102, 126, 234))  # 蓝紫色背景
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # 创建渐变效果
    for y in range(512):
        # 从蓝紫色到紫色的渐变
        ratio = y / 512
        r = int(102 + (118 - 102) * ratio)  # 102 到 118
        g = int(126 + (75 - 126) * ratio)   # 126 到 75
        b = int(234 + (186 - 234) * ratio)  # 234 到 186
        draw.rectangle([(0, y), (512, y+1)], fill=(r, g, b))
    
    # 绘制聊天气泡（对话框）
    # 左边气泡（用户）
    bubble1_coords = [(40, 120), (200, 180)]
    draw.rounded_rectangle(bubble1_coords, radius=20, fill=(255, 255, 255, 200))
    
    # 右边气泡（AI）
    bubble2_coords = [(280, 240), (460, 320)]
    draw.rounded_rectangle(bubble2_coords, radius=20, fill=(200, 220, 255, 220))
    
    # 左边气泡的小三角形
    draw.polygon([(40, 180), (20, 220), (50, 210)], fill=(255, 255, 255, 200))
    
    # 右边气泡的小三角形
    draw.polygon([(460, 320), (490, 350), (460, 340)], fill=(200, 220, 255, 220))
    
    # 在气泡中添加点（表示文字）
    # 左边气泡的点
    for i in range(3):
        draw.ellipse([(60 + i*40, 145), (75 + i*40, 160)], fill=(100, 100, 100))
    
    # 右边气泡的点
    for i in range(4):
        draw.ellipse([(300 + i*35, 265), (315 + i*35, 280)], fill=(100, 150, 255))
    
    # 添加 AI 标志（底部）
    # 绘制一个小的 AI 图标
    ai_x, ai_y = 256, 400
    
    # 绘制脑子形状的简化版本
    draw.ellipse([(ai_x-40, ai_y-40), (ai_x+40, ai_y+40)], fill=(255, 215, 0, 150))
    
    # 添加神经网络线条
    points = [
        (ai_x-30, ai_y-30), (ai_x-10, ai_y-20),
        (ai_x, ai_y), (ai_x+10, ai_y-20),
        (ai_x+30, ai_y-30)
    ]
    for i in range(len(points)-1):
        draw.line([points[i], points[i+1]], fill=(255, 255, 255), width=2)
    
    # 保存图标
    output_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(output_dir, 'assets')
    os.makedirs(assets_dir, exist_ok=True)
    
    icon_path = os.path.join(assets_dir, 'icon.png')
    img.save(icon_path)
    print(f"✅ 图标已生成: {icon_path}")
    
    # 也生成 ICO 格式（Windows）
    ico_path = os.path.join(assets_dir, 'icon.ico')
    img.save(ico_path)
    print(f"✅ Windows 图标已生成: {ico_path}")

if __name__ == '__main__':
    # 检查 PIL 是否已安装
    try:
        create_icon()
    except ImportError:
        print("需要安装 Pillow:")
        print("  pip3 install pillow")
        exit(1)
