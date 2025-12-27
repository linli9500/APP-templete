

# 启动
pnpm run web
-（增加一个feedback功能在app）
-真机测试下城市录入是否会卡

# 缓存清理与重置（解决 Compiling JS failed / Invalid UTF-8 等报错）
# 1. 停止所有正在运行的终端
# 2. 运行以下命令清理 Metro 缓存启动
npx expo start --clear

# 3. 如果想彻底强力清除 (Powershell)，请复制并运行下面这一整行：
if (Test-Path "node_modules\.cache") { Remove-Item -Path "node_modules\.cache" -Recurse -Force; Write-Host "Cache deleted" } else { Write-Host "Cache already clean" }
npx expo start --clear

# 真机推送
# 1. 重新生成原生代码（涉及到原生插件的添加/删除）
npx expo prebuild --clean
# 2. 构建并安装到真机
pnpm run android:development


# github上传
git add .
git commit -m "APP-v1.1.7-更换app的logo"
git push origin main



现在：我们放的是“品牌Slogan”（性格基因...），用来建立用户心智，这显得很高级、很专业（类似“知乎·发现更大的世界”）。
未来：您完全可以在 src/api 的 bootstrap 接口里下发一个 splash_image_url 和 splash_link。
App 启动获取配置时，如果发现有活动图，直接把中间的 Logo 或者底部的文字替换成这张活动图。
用户点击图片，直接跳转到 App 内部的购买页或活动页。
结论： 这种做法非常明智且常见。它不需要把流量卖给别人（赚微薄的广告费），而是把最宝贵的“第一眼”留给自己的产品核心价值或付费转化。您现在的设计（Logo + 核心价值文案）是非常标准的“品牌启动页”做法，既提升了格调，又教育了用户。