# RemoteRunServer

远程运行程序服务器端

本质是一个websocket服务器

使用 `typescript` 开发

* 客户端连接后如果发送 `/rc` 会被识别为远程执行客户端

* 客户端连接后如果发送 `/client` 会被识别为远程控制客户端

* 远程控制客户端(console.html)可以发送 `/run` 和 `/exit` 分别表示执行和退出

## 使用方法

需要 `node.js 10.14` 及以后版本

安装依赖

```shell
npm i
```

编译运行

```shell
npm run dev
```

手动编译运行

```shell
tsc
node index.js
```

## console.html

这是一个纯前端制作的控制台，可以连接服务器端，控制执行客户端，有执行和退出两种功能，直接使用浏览器打开即可使用
