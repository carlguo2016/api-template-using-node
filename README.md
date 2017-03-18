# api-template-using-node

This is a simple Api template for MVC using node. It is used for writing standard api.

###安装

项目地址：（`git clone`）

```shell
git clone https://github.com/carlguo2016/api-template-using-node.git
```

通过`npm`安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))

```
npm install
```

启动服务(http://127.0.0.1:3000)

```
npm start
```

###访问接口

```
http://127.0.0.1:3000/v1/user/register
```

###目录结构
<pre>
.
├── README.md   
├── package.json       // 项目配置文件
├── app.js             // 项目入口
├── api.js             // 项目api列表配置
├── lib                // 各种工具类和主要的api处理
├── model              // Model
├── controller         // Controller
├── service            // 项目业务逻辑
</pre>
