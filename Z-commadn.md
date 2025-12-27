

# 启动
pnpm run web


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
git commit -m "APP-v1.1.6-增加开屏广告并测试成功&推送通知功能（待测试）"
git push origin main


# 方式 1：只是日常开发（不需要 prebuild）
pnpm exec expo start --clear --android
# 方式 2：需要重新构建原生代码时
npx expo prebuild --clean
pnpm run android:development   # 这会自动构建并安装新的 APK


 Metro 并清理缓存：