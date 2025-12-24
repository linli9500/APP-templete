

# 启动
pnpm run web

安卓原生启动：pnpm run android:development

git add .
git commit -m "优化全局样式"
git push origin main

# 投射到手机
adb reverse tcp:8081 tcp:8081
手机浏览器打开/localhost:8081



恭喜！原生依赖和代码集成全部完成 🎉
您现在的项目已经拥有了：

Google 登录 (代码集成✅)
Apple 登录 (代码集成✅)
RevenueCat 支付 (SDK集成✅)
⚠️ 接下来的关键两步 (Configuration & Build)
因为涉及原生功能，您不能直接运行了，必须完成以下配置才能打测试包：

去哪里获取 Key?
Google: 去 Google Cloud Console 获取 WEB_CLIENT_ID。
RevenueCat: 去 RevenueCat 后台获取 iOS/Android API Keys。
填入: APP-templete/.env.development 文件中。
如何运行 APP? (Build)
请运行：npx expo run:ios (如果您用Mac) 或 npx expo run:android。
这会自动构建一个包含所有原生功能的“定制版 APP”安装到模拟器或手机上。
建议：您现在去申请这些 Key，填好之后，我们就开始构建！需要我指导如何申请某一个具体的 Key 吗？



网络层拦截器 (提升用户体验，防止静默失败)
隐私弹窗 (ATT) (上架前置条件)
推送通知 (后期运营需求)

-------

⚠️ 下一步 (留给未来)
目前代码拿到 Token 后，只是打印了 console.log。 等您那天想正式开通时，只需要做两件事：

改数据库: 在 Supabase profiles 表加个 push_token 字段。
改代码: 打开 src/lib/notifications.ts，把其中注释掉的 saveTokenToBackend 解开，Token 就能存进库里了。

