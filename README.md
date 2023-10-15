### 项目结构
```
uniapp-vue3-fant-ts
├─ .env.development----------------------------------环境变量文件dev时生效，VITE_BASEURL为接口地址
├─ .env.production-----------------------------------环境变量文件build时生效，VITE_BASEURL为接口地址
├─ .eslintignore-------------------------------------eslint豁免校验的配置，配置的文件免于eslint校验
├─ .eslintrc.js--------------------------------------eslint配置，指定eslint校验规则
├─ .gitignore
├─ .husky--------------------------------------------git hooks，此处配置了pre-commit和commit-msg两个
├─ .prettierignore---------------------------------------prettier豁免校验配置
├─ .prettierrc---------------------------------------prettier配置，指定prettier校验规则
├─ .vscode-------------------------------------------vscode配置，实现保存的时候格式化
├─ CHANGELOG.md--------------------------------------版本发布日志
├─ README.md
├─ commitlint.config.js------------------------------commitlint配置文件
├─ index.html
├─ package.json
├─ src-----------------------------------------------项目资源目录
│    ├─ api------------------------------------------API文件，用于集中管理接口
│    ├─ http-----------------------------------------基于luch-request封装的请求工具，支持拦截器，用于自定义请求和响应拦截
│    ├─ components-----------------------------------全局组件
│    ├─ config---------------------------------------全局配置
│    │    ├─ config.ts-------------------------------全局固定参数配置
│    │    ├─ constant.ts-----------------------------全局常量配置
│    │    ├─ constEnums.ts-----------------------------全局常量枚举配置
│    │    └─ tmConfig.ts-----------------------------tmUi组件可配置文件（https://tmui.design/advanced/theme.html）
│    ├─ App.vue--------------------------------------uni的主组件，所有页面都是在App.vue下进行切换的，是页面入口文件
│    ├─ hybri------------------------------------------部分组件需要在nvue下兼容，一定要，具体内容请前往gitee上下载（https://tmui.design/）.
│    ├─ tmui------------------------------------------tmui组件库（https://tmui.design/）
│    ├─ main.ts--------------------------------------入口文件，主要作用是初始化vue实例、定义全局组件
│    ├─ manifest.json--------------------------------应用的配置文件，用于指定应用的名称、图标、权限等
│    ├─ model----------------------------------------API接口用到的typescript模型，集中管理
│    ├─ pages----------------------------------------业务页面
│    ├─ pages.json-----------------------------------页面全局配置，决定页面文件的路径、窗口样式、原生的导航栏、底部的原生tabbar 等
│    ├─ static---------------------------------------资源文件，图片等
│    ├─ store----------------------------------------pinia配置，持久化存储
│    │    ├─ index.ts------------------------------持久化插件
│    │    └─ modules.ts--------------------------------模块
│    ├─ types.d.ts-----------------------------------typescript的声明文件
│    ├─ uni.scss-------------------------------------全局scss变量，无需引入可以直接使用
│    ├─ utils-------------------------------------工具类函数
│    └─ uni_modules----------------------------------uni-app插件
│           ├─ fant-mini-plus------------------------一款vue3组件库
│           └─ mp-html-------------------------------富文本插件
├─ tsconfig.json-------------------------------------TypeScript 编译器的配置文件
├─ versionrc.js--------------------------------------standard-version的配置文件
└─ vite.config.ts------------------------------------用于配置vite的配置文件
```
