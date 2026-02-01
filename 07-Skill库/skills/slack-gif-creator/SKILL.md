---
name: slack-gif-creator
description: 创建针对Slack优化的动画GIF的知识和工具。提供约束、验证工具和动画概念。当用户请求Slack的动画GIF时使用，如"为我制作一个X做Y的Slack GIF"。
license: Complete terms in LICENSE.txt
---

# Slack GIF创建器

一个提供用于创建针对Slack优化的动画GIF的工具和知识的工具包。

## Slack要求

**尺寸：**
- 表情符号GIF：128x128（推荐）
- 消息GIF：480x480

**参数：**
- FPS：10-30（越低文件越小）
- 颜色：48-128（越少文件越小）
- 时长：表情符号GIF保持3秒以下

## 核心工作流

```python
from core.gif_builder import GIFBuilder
from PIL import Image, ImageDraw

# 1. 创建构建器
builder = GIFBuilder(width=128, height=128, fps=10)

# 2. 生成帧
for i in range(12):
    frame = Image.new('RGB', (128, 128), (240, 248, 255))
    draw = ImageDraw.Draw(frame)

    # 使用PIL原语绘制动画
    # （圆形、多边形、线条等）

    builder.add_frame(frame)

# 3. 保存并优化
builder.save('output.gif', num_colors=48, optimize_for_emoji=True)
```

## 绘制图形

### 处理用户上传的图像
如果用户上传图像，考虑他们是否想要：
- **直接使用**（例如，"动画化这个"、"将其分割成帧"）
- **用作灵感**（例如，"制作类似这样的东西"）

使用PIL加载和处理图像：
```python
from PIL import Image

uploaded = Image.open('file.png')
# 直接使用，或仅作为颜色/风格的参考
```

### 从头绘制
从头绘制图形时，使用PIL ImageDraw原语：

```python
from PIL import ImageDraw

draw = ImageDraw.Draw(frame)

# 圆形/椭圆
draw.ellipse([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)

# 星星、三角形、任何多边形
points = [(x1, y1), (x2, y2), (x3, y3), ...]
draw.polygon(points, fill=(r, g, b), outline=(r, g, b), width=3)

# 线条
draw.line([(x1, y1), (x2, y2)], fill=(r, g, b), width=5)

# 矩形
draw.rectangle([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)
```

**不要使用：** 表情符号字体（跨平台不可靠）或假设此技能中存在预打包的图形。

### 让图形看起来好看

图形应该看起来精致和有创意，而非基础。方法如下：

**使用粗线条** - 始终为轮廓和线条设置`width=2`或更高。细线（width=1）看起来参差不齐和业余。

**添加视觉深度**：
- 为背景使用渐变（`create_gradient_background`）
- 分层多个形状以增加复杂性（例如，一个星星里面有一个小星星）

**让形状更有趣**：
- 不要只画一个普通的圆 - 添加高光、环或图案
- 星星可以有光晕（在后面画更大、半透明的版本）
- 组合多个形状（星星 + 闪光、圆形 + 环）

**注意颜色**：
- 使用鲜艳、互补的颜色
- 添加对比（浅色形状上的深色轮廓，深色形状上的浅色轮廓）
- 考虑整体构图

**对于复杂形状**（心形、雪花等）：
- 使用多边形和椭圆的组合
- 仔细计算点以对称
- 添加细节（心形可以有高光曲线，雪花有复杂的分支）

要有创意和细节！一个好的Slack GIF应该看起来精致，而非像占位符图形。

## 可用工具

### GIFBuilder (`core.gif_builder`)
组装帧并针对Slack优化：
```python
builder = GIFBuilder(width=128, height=128, fps=10)
builder.add_frame(frame)  # 添加PIL图像
builder.add_frames(frames)  # 添加帧列表
builder.save('out.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)
```

### 验证器 (`core.validators`)
检查GIF是否符合Slack要求：
```python
from core.validators import validate_gif, is_slack_ready

# 详细验证
passes, info = validate_gif('my.gif', is_emoji=True, verbose=True)

# 快速检查
if is_slack_ready('my.gif'):
    print("准备就绪！")
```

### 缓动函数 (`core.easing`)
平滑运动而非线性：
```python
from core.easing import interpolate

# 进度从0.0到1.0
t = i / (num_frames - 1)

# 应用缓动
y = interpolate(start=0, end=400, t=t, easing='ease_out')

# 可用：linear、ease_in、ease_out、ease_in_out、
#       bounce_out、elastic_out、back_out
```

### 帧辅助 (`core.frame_composer`)
常见需求的便利函数：
```python
from core.frame_composer import (
    create_blank_frame,         # 纯色背景
    create_gradient_background,  # 垂直渐变
    draw_circle,                # 圆形辅助
    draw_text,                  # 简单文本渲染
    draw_star                   # 五角星
)
```

## 动画概念

### 摇晃/振动
用振荡偏移对象位置：
- 使用`math.sin()`或`math.cos()`配合帧索引
- 添加小的随机变化以获得自然感觉
- 应用于x和/或y位置

### 脉冲/心跳
有节奏地缩放对象大小：
- 使用`math.sin(t * frequency * 2 * math.pi)`进行平滑脉冲
- 对于心跳：两个快速脉冲然后暂停（调整正弦波）
- 在基础大小的0.8到1.2之间缩放

### 弹跳
对象落下并弹跳：
- 使用`interpolate()`配合`easing='bounce_out'`进行着陆
- 使用`easing='ease_in'`进行下落（加速）
- 通过每帧增加y速度应用重力

### 旋转/自转
围绕中心旋转对象：
- PIL: `image.rotate(angle, resample=Image.BICUBIC)`
- 对于摆动：使用正弦波表示角度而非线性

### 淡入/淡出
逐渐出现或消失：
- 创建RGBA图像，调整alpha通道
- 或使用`Image.blend(image1, image2, alpha)`
- 淡入：alpha从0到1
- 淡出：alpha从1到0

### 滑动
将对象从屏幕外移动到位置：
- 起始位置：框架边界外
- 结束位置：目标位置
- 使用`interpolate()`配合`easing='ease_out'`进行平滑停止
- 对于过冲：使用`easing='back_out'`

### 缩放
缩放和定位以实现缩放效果：
- 放大：从0.1缩放到2.0，裁剪中心
- 缩小：从2.0缩放到1.0
- 可以添加运动模糊以增加戏剧性（PIL滤镜）

### 爆炸/粒子爆发
创建向外辐射的粒子：
- 生成具有随机角度和速度的粒子
- 更新每个粒子：`x += vx`，`y += vy`
- 添加重力：`vy += gravity_constant`
- 随时间淡出粒子（减少alpha）

## 优化策略

仅当被要求使文件大小更小时，实施以下一些方法：

1. **更少的帧** - 降低FPS（10而非20）或更短的时长
2. **更少的颜色** - `num_colors=48`而非128
3. **更小的尺寸** - 128x128而非480x480
4. **删除重复** - 在save()中使用`remove_duplicates=True`
5. **表情符号模式** - `optimize_for_emoji=True`自动优化

```python
# 表情符号的最大优化
builder.save(
    'emoji.gif',
    num_colors=48,
    optimize_for_emoji=True,
    remove_duplicates=True
)
```

## 理念

此技能提供：
- **知识**：Slack的要求和动画概念
- **工具**：GIFBuilder、验证器、缓动函数
- **灵活性**：使用PIL原语创建动画逻辑

它不提供：
- 严格的动画模板或预制函数
- 表情符号字体渲染（跨平台不可靠）
- 内置于技能中的预打包图形库

**关于用户上传的说明**：此技能不包括预构建的图形，但如果用户上传图像，使用PIL加载和处理它 - 根据他们的请求解释他们想要直接使用还是仅作为灵感。

要有创意！组合概念（弹跳 + 旋转、脉冲 + 滑动等）并使用PIL的全部功能。

## 依赖项

```bash
pip install pillow imageio numpy
```
