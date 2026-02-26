# yudao-ui-admin-vue3 目录索引

> 芋道管理后台前端，基于 Vue 3.5 + TypeScript + Vite 5 + Element Plus 2.9 + UnoCSS + Pinia

## 根目录文件

### 配置文件

- **[package.json](./package.json)** - 项目依赖与脚本配置（pnpm 包管理）
- **[vite.config.ts](./vite.config.ts)** - Vite 构建工具配置
- **[tsconfig.json](./tsconfig.json)** - TypeScript 编译配置
- **[uno.config.ts](./uno.config.ts)** - UnoCSS 原子化 CSS 配置
- **[postcss.config.js](./postcss.config.js)** - PostCSS 处理器配置
- **[.eslintrc.js](./.eslintrc.js)** - ESLint 代码检查规则
- **[prettier.config.js](./prettier.config.js)** - Prettier 代码格式化配置
- **[stylelint.config.js](./stylelint.config.js)** - Stylelint 样式检查配置

### 环境配置

- **.env** - 公共环境变量
- **.env.dev** - 开发环境变量
- **.env.local** - 本地开发环境变量
- **.env.prod** - 生产环境变量
- **.env.stage** - 预发布环境变量
- **.env.test** - 测试环境变量

### 其他文件

- **[index.html](./index.html)** - 应用入口 HTML（含加载动画）
- **[README.md](./README.md)** - 项目说明文档
- **[LICENSE](./LICENSE)** - MIT 开源许可证
- **[web-types.json](./web-types.json)** - Web Types 智能提示配置

## 构建配置

### build/

- **vite/** - Vite 插件和构建优化配置

## 静态资源

### public/

- 公共静态资源目录（favicon、logo 等，不经过构建处理）

## 类型声明

### types/

- 全局 TypeScript 类型声明文件

## 源代码

### src/api/

API 接口层，按业务模块组织：

- **erp/** - ERP 进销存接口（产品、采购、销售、库存、财务、货盘、代发、批发、样品、记事本等）
- **system/** - 系统管理接口（用户、角色、菜单、字典、部门、租户、OAuth2、短信、邮件等）
- **infra/** - 基础设施接口（代码生成、配置、文件、定时任务、API 日志等）
- **pay/** - 支付中心接口（支付应用、渠道、订单、退款、钱包等）
- **mall/** - 商城接口（商品、营销、交易、统计等）
- **member/** - 会员接口（用户、积分、签到、等级、标签等）
- **bpm/** - 工作流接口（流程模型、实例、任务、表单等）
- **mp/** - 微信公众号接口（账号、消息、菜单、素材等）
- **ai/** - AI 大模型接口（聊天、图片、思维导图、写作、音乐等）
- **crm/** - CRM 客户管理接口（商机、线索、联系人、合同等）
- **iot/** - 物联网接口（设备、产品等）
- **login/** - 登录认证接口

### src/views/

页面视图层，按业务模块组织：

- **erp/** - ERP 业务页面
  - **home/** - ERP 首页仪表盘
  - **product/** - 产品管理（产品、分类、单位、组合品）
  - **purchase/** - 采购管理（采购订单、入库、退货、审批）
  - **sale/** - 销售管理（销售订单、出库、退货、审批、售价）
  - **stock/** - 库存管理（库存盘点、入库、出库、调拨、流水、仓库）
  - **finance/** - 财务管理（账户、收付款、审批单、金额记录）
  - **distribution/** - 代发订单管理
  - **wholesale/** - 批发订单管理
  - **dropship/** - 代发辅助单管理
  - **transitsale/** - 销售中转管理
  - **sample/** - 样品管理
  - **inventory/** - 库存盘点
  - **notebook/** - 记事本
  - **person/** - 人员管理（采购员、销售员）
  - **groupbuying/** - 团购货盘管理
  - **groupbuyinginfo/** - 团购信息管理
  - **groupbuyingreview/** - 团购复盘管理
  - **livebroadcasting/** - 直播货盘管理
  - **livebroadcastinginfo/** - 直播信息管理
  - **livebroadcastingreview/** - 直播复盘管理
  - **privatebroadcasting/** - 私播货盘管理
  - **privatebroadcastinginfo/** - 私播信息管理
  - **privatebroadcastingreview/** - 私播复盘管理
- **system/** - 系统管理页面（用户、角色、菜单、字典、部门、岗位、租户、日志等）
- **infra/** - 基础设施页面（代码生成、配置、文件、任务、Redis、Swagger、监控等）
- **pay/** - 支付管理页面（应用、订单、退款、通知、钱包、充值等）
- **mall/** - 商城管理页面（商品、营销、交易、统计等）
- **member/** - 会员管理页面（用户、积分、签到、等级、标签等）
- **mp/** - 公众号管理页面
- **Login/** - 登录页面
- **Profile/** - 个人中心页面
- **report/** - 报表页面（GoView、JimuReport）

### src/components/

公共组件库：

- **Editor/** - 富文本编辑器（WangEditor）
- **RichTextWithUpload/** - 带上传功能的富文本编辑器
- **Table/** - 表格组件封装
- **Form/** - 表单组件封装
- **Search/** - 搜索组件
- **Dialog/** - 弹窗组件
- **Descriptions/** - 描述列表组件
- **Pagination/** - 分页组件
- **DictTag/** - 字典标签组件
- **Icon/** - 图标组件（Iconify）
- **Echart/** - ECharts 图表组件
- **UploadFile/** - 文件上传组件
- **ImageViewer/** - 图片预览组件
- **Cropper/** - 图片裁剪组件
- **Qrcode/** - 二维码生成组件
- **ContentWrap/** - 内容区域包装组件
- **ContentDetailWrap/** - 详情页内容包装
- **Card/** - 卡片组件
- **CountTo/** - 数字滚动动画组件
- **Crontab/** - Cron 表达式生成器
- **Draggable/** - 拖拽排序组件
- **DiyEditor/** - DIY 可视化页面编辑器
- **FormCreate/** - 动态表单生成器
- **bpmnProcessDesigner/** - BPMN 流程设计器
- **SimpleProcessDesignerV2/** - 简易流程设计器 V2
- **MarkdownView/** - Markdown 渲染组件
- **Verifition/** - 验证码组件
- **UserSelectForm/** - 用户选择表单
- **ImportResultDialog/** - 导入结果弹窗
- **OperateLogV2/** - 操作日志组件 V2
- **SummaryCard/** - 汇总卡片组件
- **ShortcutDateRangePicker/** - 快捷日期范围选择器
- **TextParser/** - 文本解析组件
- **VerticalButtonGroup/** - 垂直按钮组

### src/store/

Pinia 状态管理（持久化支持）

### src/router/

Vue Router 路由配置

### src/hooks/

Vue 组合式函数（Composables）

### src/utils/

工具函数库

### src/styles/

全局样式（SCSS）

### src/locales/

国际化语言包（vue-i18n）

### src/layout/

页面布局组件（侧边栏、顶栏、标签页等）

### src/plugins/

Vue 插件注册

### src/directives/

Vue 自定义指令

### src/config/

应用全局配置

### src/assets/

静态资源（图片、SVG 图标、音频、地图数据等）

### src/types/

TypeScript 类型定义

## 子目录文档

- **[src/views/erp/distribution/order/components/README.md](./src/views/erp/distribution/order/components/README.md)** - 代发订单详情页复制数据功能说明
- **[src/views/erp/product/product/form/README.md](./src/views/erp/product/product/form/README.md)** - 产品详情页复制数据功能说明
