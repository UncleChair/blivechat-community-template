# BliveChat 只熊版 DOM 兼容HTML模板

本插件旨在帮助用户从停止维护的社区版本（只熊修改版）迁移至原版，保证大部分基于修改版编写的CSS可用性。

[修改版项目地址](https://github.com/DoodleBears/blivechat)

## 安装

### 本地安装
__⚠注意⚠ 本项目基于BliveChat自定义HTML功能，请确保您将使用v1.10版本以上的BliveChat__

1. 找到 `BliveChat` 文件夹位置并打开目录 `data\custom_public\templates`
2. 下载并将本项目文件解压至上面开启的文件夹

解压完成后目录应该是这样的：

`data\custom_public\templates\blivechat-community-template`

该目录下应当包含`index.html`文件

如果出现目录嵌套将无法正常使用，例如：

`data\custom_public\templates\blivechat-community-template\blivechat-community-template`

将无法解析模板

3. 启动`BliveChat`主程序，在`首页`的`自定义HTML模板`中可以找到 `blivechat-community`模板，选中后即可使用

### 在线链接

https://unclechair.vip/blivedom/
将该链接复制到自定义html模板中的模板URL即可使用

__⚠注意⚠ 本链接不保证可用性，如果发现不能使用请直接改为之前的本地安装方法__

## 使用

Blivechat v1.10.1 新增[支持OBS中的自定义CSS](https://github.com/xfgryujk/blivechat/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89HTML%E6%A8%A1%E6%9D%BF#%E6%94%AF%E6%8C%81obs%E4%B8%AD%E7%9A%84%E8%87%AA%E5%AE%9A%E4%B9%89css)

## 注意事项

本项目包含绝大部分的只熊版样式和DOM结构，但可能在细微的地方有所差别，并且不支持只熊版的以下功能：

- 本地自定义表情包
- 弹幕随机位置
- 弹幕随机颜色
- 一些额外添加的显示控制功能

请确保您的原始项目不基于这些特性编写

如果您发现了一些未提及的不一致行为，欢迎issue或pr
