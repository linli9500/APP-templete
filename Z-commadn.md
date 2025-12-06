安装依赖：pnpm install

启动
pnpm run web


git add .
git commit -m "新增注册登录及对接supabase"
git push origin main


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