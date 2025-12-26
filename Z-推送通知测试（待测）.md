错误信息说得很清楚：

无效凭据：无法检索收件人应用的 FCM 服务器密钥。请确保您已按照 Expo FCM 文档的说明提供服务器密钥。

问题原因
Android 推送需要配置 Firebase Cloud Messaging (FCM)，你还没有配置。

解决步骤
1. 创建 Firebase 项目
访问 Firebase Console
创建新项目（或使用现有项目）
添加 Android 应用，包名填写：com.vibefox.app.development
下载 真实的 
google-services.json
，替换 
I:\A\google-services.json
2. 获取 FCM 服务器密钥
Firebase Console → 项目设置 → Cloud Messaging
找到 服务器密钥（Server Key）或 旧版服务器密钥
复制这个密钥
3. 配置 Expo 项目
访问 expo.dev 并登录
进入你的项目 → Credentials → Android
添加 FCM 服务器密钥
或者使用命令行：

bash
eas credentials
总结
需要	状态
Firebase 项目	❌ 需要创建
google-services.json
⚠️ 需要真实文件
FCM 服务器密钥	❌ 需要配置到 Expo
Apple Developer 账号	iOS 才需要
配置完成后，推送通知就能正常工作了。

