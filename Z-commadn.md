

# 启动
pnpm run web

# 真机推送
# 1. 重新生成原生代码（涉及到原生插件的添加/删除）
npx expo prebuild --clean
# 2. 构建并安装到真机
pnpm run android:development


# github上传
git add .
git commit -m "APP-v1.1.6-setting页面的内容优化以及分享卡片和删除账号功能"
git push origin main

删除账号的需要修改后端的判断条件（这个可能还没有加）-待测试
