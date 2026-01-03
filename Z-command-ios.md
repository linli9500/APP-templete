# 启动-在xcode构建成功后，执行下面的指令就可以运行了
pnpm run ios:development
pnpm run start:development


# 真机测试
打开xcode
xed ios
进入xcode后点击左上角的三角形运行到真机

# 1. 清理 iOS 原生目录 (生成新的原生代码)
npx expo prebuild --clean --platform ios
# 2. 重新安装依赖 (确保 node_modules 干净)
rm -rf node_modules
pnpm install
# 3. 重新构建并运行 (这一步会重新编译 App 并安装到手机)
pnpm run ios:development --device


# 待办

1、apple账号登录，
2、sentry需要
3、可以去apple申请付费墙相关的信息了
4、apple去申请苹果登录的key
