

启动
pnpm run web

安卓原生启动：pnpm run android:development

git add .
git commit -m "1、增加崩溃监控sentry2、增加聚合接口功能"
git push origin main

C:\Program Files\Android\Android Studio

#投射到手机
1、adb reverse tcp:8081 tcp:8081
2、手机直接输入：直接输入： http://localhost:8081


⚡ 必杀技：USB 反向代理 (解决所有网络问题)
既然已经连了 USB，我们可以建立一个稳定通道，这样甚至不需要连 WiFi 都能调试。

请依次运行以下命令：

建立通道 (把电脑的 8081 端口映射到手机):
powershell
adb reverse tcp:8081 tcp:8081
在手机浏览器输入： 拿起手机，打开 Chrome 或自带浏览器，直接输入： http://localhost:8081
只要步骤 1 运行成功，步骤 2 里的手机浏览器就会自动唤起 Expo Go APP 并加载您的项目。 （如果手机提示是否打开 Expo Go，选“是”）


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