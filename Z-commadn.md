

# 启动
pnpm run web

# 安卓构建指令
pnpm run android:development


# github上传
git add .
git commit -m "APP-v1.1.0-传入接口增加字段等以及UI优化和开发规则强制约束拆分翻译文件"
git push origin main


# 投射到手机
adb reverse tcp:8081 tcp:8081
手机浏览器打开http://localhost:8081


# 真机测试
# 先关掉当前模拟器（避免 multiple devices）
# 然后运行：
pnpm run android:development

# 真机测试2
eas build --profile development --platform android --local
然后把生成的 APK 文件传到手机上安装。

-------

⚠️ 下一步 (留给未来)
目前代码拿到 Token 后，只是打印了 console.log。 等您那天想正式开通时，只需要做两件事：

改数据库: 在 Supabase profiles 表加个 push_token 字段。
改代码: 打开 src/lib/notifications.ts，把其中注释掉的 saveTokenToBackend 解开，Token 就能存进库里了。

