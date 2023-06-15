# SmsForwarder-WechatPushApi
接收SmsForwarder的信息，转发到微信测试号，借此实现推送消息目的

### 使用方法
- worker.js部署到cloudflare workers
- 微信端模板复制即可：
```string
来信号码:{{phoneNumber.DATA}}
来信内容:{{messageContent.DATA}}
接收号码:{{receiverNumber.DATA}}
接收时间:{{timestamp.DATA}}
推送终端:{{client.DATA}}
```
