import { Layout } from '@/utils/routerHelper'

const { t } = useI18n()
/**
 * redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
 hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

 alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
 只有一个时，会将那个子路由当做根路由显示在侧边栏，
 若你想不管路由下面的 children 声明的个数都显示你的根路由，
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
 一直显示根路由(默认 false)

 title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

 icon: 'svg-name'          设置该路由的图标

 noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

 breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

 affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

 noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

 activeMenu: '/dashboard'  显示高亮的路由路径

 followAuth: '/dashboard'  跟随哪个路由进行权限过滤

 canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
 }
 **/
const remainingRouter: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Home',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/Home/Index.vue'),
        name: 'Index',
        meta: {
          title: t('router.home'),
          icon: 'ep:home-filled',
          noCache: false,
          affix: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'UserInfo',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'Profile',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: t('common.profile')
        }
      },
      {
        path: 'notify-message',
        component: () => import('@/views/system/notify/my/index.vue'),
        name: 'MyNotifyMessage',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:message',
          title: '我的站内信'
        }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    name: 'dict',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'type/data/:dictType',
        component: () => import('@/views/system/dict/data/index.vue'),
        name: 'SystemDictData',
        meta: {
          title: '字典数据',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/system/dict'
        }
      }
    ]
  },

  {
    path: '/codegen',
    component: Layout,
    name: 'CodegenEdit',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'edit',
        component: () => import('@/views/infra/codegen/EditTable.vue'),
        name: 'InfraCodegenEditTable',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '修改生成配置',
          activeMenu: 'infra/codegen/index'
        }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    name: 'JobL',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'job-log',
        component: () => import('@/views/infra/job/logger/index.vue'),
        name: 'InfraJobLog',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '调度日志',
          activeMenu: 'infra/job/index'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/sso',
    component: () => import('@/views/Login/Login.vue'),
    name: 'SSOLogin',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/social-login',
    component: () => import('@/views/Login/SocialLogin.vue'),
    name: 'SocialLogin',
    meta: {
      hidden: true,
      title: t('router.socialLogin'),
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: 'Error',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  {
    path: '/bpm',
    component: Layout,
    name: 'bpm',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'manager/form/edit',
        component: () => import('@/views/bpm/form/editor/index.vue'),
        name: 'BpmFormEditor',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '设计流程表单',
          activeMenu: '/bpm/manager/form'
        }
      },
      {
        path: 'manager/model/edit',
        component: () => import('@/views/bpm/model/editor/index.vue'),
        name: 'BpmModelEditor',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '设计流程',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'manager/simple/model',
        component: () => import('@/views/bpm/simple/SimpleModelDesign.vue'),
        name: 'SimpleModelDesign',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '仿钉钉设计流程',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'manager/definition',
        component: () => import('@/views/bpm/definition/index.vue'),
        name: 'BpmProcessDefinition',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程定义',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'process-instance/detail',
        component: () => import('@/views/bpm/processInstance/detail/index.vue'),
        name: 'BpmProcessInstanceDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程详情',
          activeMenu: '/bpm/task/my'
        },
        props: (route) => ({
          id: route.query.id,
          taskId: route.query.taskId,
          activityId: route.query.activityId
        })
      },
      {
        path: 'process-instance/report',
        component: () => import('@/views/bpm/processInstance/report/index.vue'),
        name: 'BpmProcessInstanceReport',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '数据报表',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'oa/leave/create',
        component: () => import('@/views/bpm/oa/leave/create.vue'),
        name: 'OALeaveCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '发起 OA 请假',
          activeMenu: '/bpm/oa/leave'
        }
      },
      {
        path: 'oa/leave/detail',
        component: () => import('@/views/bpm/oa/leave/detail.vue'),
        name: 'OALeaveDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '查看 OA 请假',
          activeMenu: '/bpm/oa/leave'
        }
      },
      {
        path: 'manager/model/create',
        component: () => import('@/views/bpm/model/form/index.vue'),
        name: 'BpmModelCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '创建流程',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        // TODO @zws：1）建议，在加一个路由。然后标题是“复制流程”，这样体验会好点；2）复制出来的数据，在名字前面，加“副本 ”，和钉钉保持一致！
        path: 'manager/model/:type/:id',
        component: () => import('@/views/bpm/model/form/index.vue'),
        name: 'BpmModelUpdate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '修改流程',
          activeMenu: '/bpm/manager/model'
        }
      }
    ]
  },
  {
    path: '/erp/product', // ERP
    component: Layout, // 布局组件
    name: 'ProductManagement',
    meta: {
      hidden: true // 在菜单中隐藏父路由
    },
    children: [
      {
        path: 'product/add', // 添加商品
        component: () => import('@/views/erp/product/product/form/index.vue'),
        name: 'ErpProductAdd',
        meta: {
          noCache: false, // 需要缓存
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '产品添加',
          activeMenu: '/erp/product/product/index'
        }
      },
      {
        path: 'product/edit/:id(\\d+)', // 编辑商品
        component: () => import('@/views/erp/product/product/form/index.vue'),
        name: 'ErpProductEdit',
        meta: {
          noCache: true, // 不缓存
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '产品编辑',
          activeMenu: '/erp/product/product/index'
        }
      },
      {
        path: 'product/detail/:id(\\d+)', // 商品详情
        component: () => import('@/views/erp/product/product/form/index.vue'),
        name: 'ErpProductDetail',
        meta: {
          noCache: true, // 不缓存
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '产品详情',
          activeMenu: '/erp/product/product/index'
        }
      }
    ]
  },
  {
    path: '/erp/combo', // ERP 组合产品
    component: Layout, // 布局组件
    name: 'ComboProductManagement',
    meta: {
      hidden: true // 在菜单中隐藏父路由
    },
    children: [
      {
        path: 'combo/add', // 添加组合产品
        component: () => import('@/views/erp/product/combo/form/index.vue'),
        name: 'ErpComboAdd',
        meta: {
          noCache: false, // 需要缓存
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '组合产品添加',
          activeMenu: '/erp/combo/combo/index'
        }
      },
      {
        path: 'combo/edit/:id(\\d+)', // 编辑组合产品
        component: () => import('@/views/erp/product/combo/form/index.vue'),
        name: 'ErpComboEdit',
        meta: {
          noCache: true, // 不缓存
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '组合产品编辑',
          activeMenu: '/erp/combo/combo/index'
        }
      },
      {
        path: 'combo/detail/:id(\\d+)', // 组合产品详情
        component: () => import('@/views/erp/product/combo/form/index.vue'),
        name: 'ErpComboDetail',
        meta: {
          noCache: true, // 不缓存
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '组合产品详情',
          activeMenu: '/erp/combo/combo/index'
        }
      }
    ]
  },
  {
    path: '/erp/inventory', // ERP 库存管理
    component: Layout,
    name: 'ErpInventoryManagement',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'add', // 添加库存
        component: () => import('@/views/erp/inventory/form/index.vue'),
        name: 'ErpInventoryAdd',
        meta: {
          noCache: false,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '库存添加',
          activeMenu: '/erp/inventory/index'
        }
      },
      {
        path: 'edit/:id(\\d+)', // 编辑库存
        component: () => import('@/views/erp/inventory/form/index.vue'),
        name: 'ErpInventoryEdit',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '库存编辑',
          activeMenu: '/erp/inventory/index'
        }
      },
      {
        path: 'detail/:id(\\d+)', // 库存详情
        component: () => import('@/views/erp/inventory/form/index.vue'),
        name: 'ErpInventoryDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '库存详情',
          activeMenu: '/erp/inventory/index'
        }
      }
    ]
  },


{
  path: '/erp/notebook', // ERP 记事本管理
  component: Layout,
  name: 'ErpNotebookManagement',
  meta: {
    hidden: true
  },
  children: [
    {
      path: 'add', // 添加记事本
      component: () => import('@/views/erp/notebook/form/index.vue'),
      name: 'ErpNotebookAdd',
      meta: {
        noCache: false,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '记事本添加',
        activeMenu: '/erp/notebook/index'
      }
    },
    {
      path: 'edit/:id(\\d+)', // 编辑记事本
      component: () => import('@/views/erp/notebook/form/index.vue'),
      name: 'ErpNotebookEdit',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '记事本编辑',
        activeMenu: '/erp/notebook/index'
      }
    },
    {
      path: 'detail/:id(\\d+)', // 记事本详情
      component: () => import('@/views/erp/notebook/form/index.vue'),
      name: 'ErpNotebookDetail',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:view',
        title: '记事本详情',
        activeMenu: '/erp/notebook/index'
      }
    }
  ]
},

{
  path: '/erp/sample', // ERP 样品管理
  component: Layout,
  name: 'ErpSampleManagement',
  meta: {
    hidden: true
  },
  children: [
    {
      path: 'add', // 添加样品
      component: () => import('@/views/erp/sample/form/index.vue'),
      name: 'ErpSampleAdd',
      meta: {
        noCache: false,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '样品添加',
        activeMenu: '/erp/sample/index'
      }
    },
    {
      path: 'edit/:id(\\d+)', // 编辑样品
      component: () => import('@/views/erp/sample/form/index.vue'),
      name: 'ErpSampleEdit',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '样品编辑',
        activeMenu: '/erp/sample/index'
      }
    },
    {
      path: 'detail/:id(\\d+)', // 样品详情
      component: () => import('@/views/erp/sample/form/index.vue'),
      name: 'ErpSampleDetail',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:view',
        title: '样品详情',
        activeMenu: '/erp/sample/index'
      }
    }
  ]
},
// ... existing code ...

{
  path: '/erp/groupbuying', // ERP 团购货盘管理
  component: Layout,
  name: 'ErpGroupBuyingManagement',
  meta: {
    hidden: true
  },
  children: [
    {
      path: 'add', // 添加团购货盘
      component: () => import('@/views/erp/groupbuying/form/index.vue'),
      name: 'ErpGroupBuyingAdd',
      meta: {
        noCache: false,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '团购货盘添加',
        activeMenu: '/erp/groupbuying/index'
      }
    },
    {
      path: 'edit/:id(\\d+)', // 编辑团购货盘
      component: () => import('@/views/erp/groupbuying/form/index.vue'),
      name: 'ErpGroupBuyingEdit',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '团购货盘编辑',
        activeMenu: '/erp/groupbuying/index'
      }
    },
    {
      path: 'detail/:id(\\d+)', // 团购货盘详情
      component: () => import('@/views/erp/groupbuying/form/index.vue'),
      name: 'ErpGroupBuyingDetail',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:view',
        title: '团购货盘详情',
        activeMenu: '/erp/groupbuying/index'
      }
    }
  ]
},

{
  path: '/erp/groupbuyingreview', // ERP 团购复盘管理
  component: Layout,
  name: 'ErpGroupBuyingReviewManagement',
  meta: {
    hidden: true
  },
  children: [
    {
      path: 'add', // 添加团购复盘
      component: () => import('@/views/erp/groupbuyingreview/form/index.vue'),
      name: 'ErpGroupBuyingReviewAdd',
      meta: {
        noCache: false,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '团购复盘添加',
        activeMenu: '/erp/groupbuyingreview/index'
      }
    },
    {
      path: 'edit/:id(\\d+)', // 编辑团购复盘
      component: () => import('@/views/erp/groupbuyingreview/form/index.vue'),
      name: 'ErpGroupBuyingReviewEdit',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '团购复盘编辑',
        activeMenu: '/erp/groupbuyingreview/index'
      }
    },
    {
      path: 'detail/:id(\\d+)', // 团购复盘详情
      component: () => import('@/views/erp/groupbuyingreview/form/index.vue'),
      name: 'ErpGroupBuyingReviewDetail',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:view',
        title: '团购复盘详情',
        activeMenu: '/erp/groupbuyingreview/index'
      }
    }
  ]
},

// ... existing code ...

{
  path: '/erp/groupbuyinginfo', // ERP 团购信息管理
  component: Layout,
  name: 'ErpGroupBuyingInfoManagement',
  meta: {
    hidden: true
  },
  children: [
    {
      path: 'index', // 团购信息列表
      component: () => import('@/views/erp/groupbuyinginfo/index.vue'),
      name: 'ErpGroupBuyingInfo',
      meta: {
        title: '团购信息',
        icon: 'ep:list',
        noCache: false
      }
    },
    {
      path: 'add', // 添加团购信息
      component: () => import('@/views/erp/groupbuyinginfo/form/index.vue'),
      name: 'ErpGroupBuyingInfoAdd',
      meta: {
        noCache: false,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '团购信息添加',
        activeMenu: '/erp/groupbuyinginfo/index'
      }
    },
    {
      path: 'edit/:id(\\d+)', // 编辑团购信息
      component: () => import('@/views/erp/groupbuyinginfo/form/index.vue'),
      name: 'ErpGroupBuyingInfoEdit',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '团购信息编辑',
        activeMenu: '/erp/groupbuyinginfo/index'
      }
    },
    {
      path: 'detail/:id(\\d+)', // 团购信息详情
      component: () => import('@/views/erp/groupbuyinginfo/form/index.vue'),
      name: 'ErpGroupBuyingInfoDetail',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:view',
        title: '团购信息详情',
        activeMenu: '/erp/groupbuyinginfo/index'
      }
    }
  ]
},
// ... existing code ...

{
  path: '/erp/live-broadcasting', // ERP 直播货盘管理
  component: Layout,
  name: 'ErpLiveBroadcastingManagement',
  meta: {
    hidden: true
  },
  children: [
    {
      path: 'index', // 直播货盘列表
      component: () => import('@/views/erp/livebroadcasting/index.vue'),
      name: 'ErpLiveBroadcasting',
      meta: {
        title: '直播货盘',
        icon: 'ep:list',
        noCache: false
      }
    },
    {
      path: 'add', // 添加直播货盘
      component: () => import('@/views/erp/livebroadcasting/form/index.vue'),
      name: 'ErpLiveBroadcastingAdd',
      meta: {
        noCache: false,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '直播货盘添加',
        activeMenu: '/erp/live-broadcasting/index'
      }
    },
    {
      path: 'edit/:id(\\d+)', // 编辑直播货盘
      component: () => import('@/views/erp/livebroadcasting/form/index.vue'),
      name: 'ErpLiveBroadcastingEdit',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '直播货盘编辑',
        activeMenu: '/erp/live-broadcasting/index'
      }
    },
    {
      path: 'detail/:id(\\d+)', // 直播货盘详情
      component: () => import('@/views/erp/livebroadcasting/form/index.vue'),
      name: 'ErpLiveBroadcastingDetail',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:view',
        title: '直播货盘详情',
        activeMenu: '/erp/live-broadcasting/index'
      }
    }
  ]
},
// ... existing code ...

{
  path: '/erp/live-broadcasting-review', // ERP 直播复盘管理
  component: Layout,
  name: 'ErpLiveBroadcastingReviewManagement',
  meta: {
    hidden: true
  },
  children: [
    {
      path: 'index', // 直播复盘列表
      component: () => import('@/views/erp/livebroadcastingreview/index.vue'),
      name: 'ErpLiveBroadcastingReview',
      meta: {
        title: '直播复盘',
        icon: 'ep:list',
        noCache: false
      }
    },
    {
      path: 'add', // 添加直播复盘
      component: () => import('@/views/erp/livebroadcastingreview/form/index.vue'),
      name: 'ErpLiveBroadcastingReviewAdd',
      meta: {
        noCache: false,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '直播复盘添加',
        activeMenu: '/erp/live-broadcasting-review/index'
      }
    },
    {
      path: 'edit/:id(\\d+)', // 编辑直播复盘
      component: () => import('@/views/erp/livebroadcastingreview/form/index.vue'),
      name: 'ErpLiveBroadcastingReviewEdit',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '直播复盘编辑',
        activeMenu: '/erp/live-broadcasting-review/index'
      }
    },
    {
      path: 'detail/:id(\\d+)', // 直播复盘详情
      component: () => import('@/views/erp/livebroadcastingreview/form/index.vue'),
      name: 'ErpLiveBroadcastingReviewDetail',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:view',
        title: '直播复盘详情',
        activeMenu: '/erp/live-broadcasting-review/index'
      }
    }
  ]
},
// ... existing code ...

{
  path: '/erp/live-broadcasting-info', // ERP 直播信息管理
  component: Layout,
  name: 'ErpLiveBroadcastingInfoManagement',
  meta: {
    hidden: true
  },
  children: [
    {
      path: 'index', // 直播信息列表
      component: () => import('@/views/erp/livebroadcastinginfo/index.vue'),
      name: 'ErpLiveBroadcastingInfo',
      meta: {
        title: '直播信息',
        icon: 'ep:list',
        noCache: false
      }
    },
    {
      path: 'add', // 添加直播信息
      component: () => import('@/views/erp/livebroadcastinginfo/form/index.vue'),
      name: 'ErpLiveBroadcastingInfoAdd',
      meta: {
        noCache: false,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '直播信息添加',
        activeMenu: '/erp/live-broadcasting-info/index'
      }
    },
    {
      path: 'edit/:id(\\d+)', // 编辑直播信息
      component: () => import('@/views/erp/livebroadcastinginfo/form/index.vue'),
      name: 'ErpLiveBroadcastingInfoEdit',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '直播信息编辑',
        activeMenu: '/erp/live-broadcasting-info/index'
      }
    },
    {
      path: 'detail/:id(\\d+)', // 直播信息详情
      component: () => import('@/views/erp/livebroadcastinginfo/form/index.vue'),
      name: 'ErpLiveBroadcastingInfoDetail',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:view',
        title: '直播信息详情',
        activeMenu: '/erp/live-broadcasting-info/index'
      }
    }
  ]
},


{
  path: '/erp/dropship-assist', // ERP 代发辅助管理
  component: Layout,
  name: 'ErpDropshipAssistManagement',
  meta: {
    hidden: true
  },
  children: [
    {
      path: 'add', // 添加代发辅助
      component: () => import('@/views/erp/dropship/form/index.vue'),
      name: 'ErpDropshipAssistAdd',
      meta: {
        noCache: false,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '代发辅助添加',
        activeMenu: '/erp/dropship-assist/index'
      }
    },
    {
      path: 'edit/:id(\\d+)', // 编辑代发辅助
      component: () => import('@/views/erp/dropship/form/index.vue'),
      name: 'ErpDropshipAssistEdit',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:edit',
        title: '代发辅助编辑',
        activeMenu: '/erp/dropship-assist/index'
      }
    },
    {
      path: 'detail/:id(\\d+)', // 代发辅助详情
      component: () => import('@/views/erp/dropship/form/index.vue'),
      name: 'ErpDropshipAssistDetail',
      meta: {
        noCache: true,
        hidden: true,
        canTo: true,
        icon: 'ep:view',
        title: '代发辅助详情',
        activeMenu: '/erp/dropship-assist/index'
      }
    }
  ]
},

// ... existing code ...


  {
    path: '/mall/product', // 商品中心
    component: Layout,
    name: 'ProductCenter',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'spu/add',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuAdd',
        meta: {
          noCache: false, // 需要缓存
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '商品添加',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'spu/edit/:id(\\d+)',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuEdit',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '商品编辑',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'spu/detail/:id(\\d+)',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '商品详情',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'property/value/:propertyId(\\d+)',
        component: () => import('@/views/mall/product/property/value/index.vue'),
        name: 'ProductPropertyValue',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '商品属性值',
          activeMenu: '/product/property'
        }
      }
    ]
  },
  {
    path: '/mall/trade', // 交易中心
    component: Layout,
    name: 'TradeCenter',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'order/detail/:id(\\d+)',
        component: () => import('@/views/mall/trade/order/detail/index.vue'),
        name: 'TradeOrderDetail',
        meta: { title: '订单详情', icon: 'ep:view', activeMenu: '/mall/trade/order' }
      },
      {
        path: 'after-sale/detail/:id(\\d+)',
        component: () => import('@/views/mall/trade/afterSale/detail/index.vue'),
        name: 'TradeAfterSaleDetail',
        meta: { title: '退款详情', icon: 'ep:view', activeMenu: '/mall/trade/after-sale' }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    name: 'MemberCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'user/detail/:id',
        name: 'MemberUserDetail',
        meta: {
          title: '会员详情',
          noCache: true,
          hidden: true
        },
        component: () => import('@/views/member/user/detail/index.vue')
      }
    ]
  },
  {
    path: '/pay',
    component: Layout,
    name: 'pay',
    meta: { hidden: true },
    children: [
      {
        path: 'cashier',
        name: 'PayCashier',
        meta: {
          title: '收银台',
          noCache: true,
          hidden: true
        },
        component: () => import('@/views/pay/cashier/index.vue')
      }
    ]
  },
  {
    path: '/diy',
    name: 'DiyCenter',
    meta: { hidden: true },
    component: Layout,
    children: [
      {
        path: 'template/decorate/:id',
        name: 'DiyTemplateDecorate',
        meta: {
          title: '模板装修',
          noCache: true,
          hidden: true,
          activeMenu: '/mall/promotion/diy/template'
        },
        component: () => import('@/views/mall/promotion/diy/template/decorate.vue')
      },
      {
        path: 'page/decorate/:id',
        name: 'DiyPageDecorate',
        meta: {
          title: '页面装修',
          noCache: true,
          hidden: true,
          activeMenu: '/mall/promotion/diy/page'
        },
        component: () => import('@/views/mall/promotion/diy/page/decorate.vue')
      }
    ]
  },
  {
    path: '/crm',
    component: Layout,
    name: 'CrmCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'clue/detail/:id',
        name: 'CrmClueDetail',
        meta: {
          title: '线索详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/clue'
        },
        component: () => import('@/views/crm/clue/detail/index.vue')
      },
      {
        path: 'customer/detail/:id',
        name: 'CrmCustomerDetail',
        meta: {
          title: '客户详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/customer'
        },
        component: () => import('@/views/crm/customer/detail/index.vue')
      },
      {
        path: 'business/detail/:id',
        name: 'CrmBusinessDetail',
        meta: {
          title: '商机详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/business'
        },
        component: () => import('@/views/crm/business/detail/index.vue')
      },
      {
        path: 'contract/detail/:id',
        name: 'CrmContractDetail',
        meta: {
          title: '合同详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/contract'
        },
        component: () => import('@/views/crm/contract/detail/index.vue')
      },
      {
        path: 'receivable-plan/detail/:id',
        name: 'CrmReceivablePlanDetail',
        meta: {
          title: '回款计划详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/receivable-plan'
        },
        component: () => import('@/views/crm/receivable/plan/detail/index.vue')
      },
      {
        path: 'receivable/detail/:id',
        name: 'CrmReceivableDetail',
        meta: {
          title: '回款详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/receivable'
        },
        component: () => import('@/views/crm/receivable/detail/index.vue')
      },
      {
        path: 'contact/detail/:id',
        name: 'CrmContactDetail',
        meta: {
          title: '联系人详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/contact'
        },
        component: () => import('@/views/crm/contact/detail/index.vue')
      },
      {
        path: 'product/detail/:id',
        name: 'CrmProductDetail',
        meta: {
          title: '产品详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/product'
        },
        component: () => import('@/views/crm/product/detail/index.vue')
      }
    ]
  },
  {
    path: '/ai',
    component: Layout,
    name: 'Ai',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'image/square',
        component: () => import('@/views/ai/image/square/index.vue'),
        name: 'AiImageSquare',
        meta: {
          title: '绘图作品',
          icon: 'ep:home-filled',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/Error/404.vue'),
    name: '',
    meta: {
      title: '404',
      hidden: true,
      breadcrumb: false
    }
  },
  {
    path: '/iot',
    component: Layout,
    name: 'IOT',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'product/detail/:id',
        name: 'IoTProductDetail',
        meta: {
          title: '产品详情',
          noCache: true,
          hidden: true,
          activeMenu: '/iot/product'
        },
        component: () => import('@/views/iot/product/detail/index.vue')
      },
      {
        path: 'device/detail/:id',
        name: 'IoTDeviceDetail',
        meta: {
          title: '设备详情',
          noCache: true,
          hidden: true,
          activeMenu: '/iot/device'
        },
        component: () => import('@/views/iot/device/detail/index.vue')
      }
    ]
  },
  {
    path: '/erp/private-broadcasting', // ERP 私播货盘管理
    component: Layout,
    name: 'ErpPrivateBroadcastingManagement',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'add/:copyId(\\d+)?', // 添加私播货盘，支持复制功能
        component: () => import('@/views/erp/privatebroadcasting/form/index.vue'),
        name: 'ErpPrivateBroadcastingAdd',
        meta: {
          noCache: false,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '私播货盘添加',
          activeMenu: '/erp/private-broadcasting/index'
        }
      },
      {
        path: 'edit/:id(\\d+)', // 编辑私播货盘
        component: () => import('@/views/erp/privatebroadcasting/form/index.vue'),
        name: 'ErpPrivateBroadcastingEdit',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '私播货盘编辑',
          activeMenu: '/erp/private-broadcasting/index'
        }
      },
      {
        path: 'detail/:id(\\d+)', // 私播货盘详情
        component: () => import('@/views/erp/privatebroadcasting/form/index.vue'),
        name: 'ErpPrivateBroadcastingDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '私播货盘详情',
          activeMenu: '/erp/private-broadcasting/index'
        }
      }
    ]
  },
  {
    path: '/erp/private-broadcasting-review',
    component: Layout,
    name: 'ErpPrivateBroadcastingReviewManagement',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'add/:copyId(\\d+)?',
        component: () => import('@/views/erp/privatebroadcastingreview/form/index.vue'),
        name: 'ErpPrivateBroadcastingReviewAdd',
        meta: {
          noCache: false,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '私播复盘添加',
          activeMenu: '/erp/private-broadcasting-review/index'
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/erp/privatebroadcastingreview/form/index.vue'),
        name: 'ErpPrivateBroadcastingReviewEdit',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '私播复盘编辑',
          activeMenu: '/erp/private-broadcasting-review/index'
        }
      },
      {
        path: 'detail/:id(\\d+)',
        component: () => import('@/views/erp/privatebroadcastingreview/form/index.vue'),
        name: 'ErpPrivateBroadcastingReviewDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '私播复盘详情',
          activeMenu: '/erp/private-broadcasting-review/index'
        }
      }
    ]
  },
  {
    path: '/erp/private-broadcasting-info',
    component: Layout,
    name: 'ErpPrivateBroadcastingInfoManagement',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'add',
        component: () => import('@/views/erp/privatebroadcastinginfo/form/index.vue'),
        name: 'ErpPrivateBroadcastingInfoAdd',
        meta: {
          noCache: false,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '私播信息添加',
          activeMenu: '/erp/private-broadcasting-info/index'
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/erp/privatebroadcastinginfo/form/index.vue'),
        name: 'ErpPrivateBroadcastingInfoEdit',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '私播信息编辑',
          activeMenu: '/erp/private-broadcasting-info/index'
        }
      },
      {
        path: 'detail/:id(\\d+)',
        component: () => import('@/views/erp/privatebroadcastinginfo/form/index.vue'),
        name: 'ErpPrivateBroadcastingInfoDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '私播信息详情',
          activeMenu: '/erp/private-broadcasting-info/index'
        }
      }
    ]
  },
  {
    path: '/erp/sample', // ERP 样品管理
    component: Layout,
    name: 'ErpSampleManagement',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'add', // 添加样品
        component: () => import('@/views/erp/sample/form/index.vue'),
        name: 'ErpSampleAdd',
        meta: {
          noCache: false,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '样品添加',
          activeMenu: '/erp/sample/index'
        }
      },
      {
        path: 'edit/:id(\\d+)', // 编辑样品
        component: () => import('@/views/erp/sample/form/index.vue'),
        name: 'ErpSampleEdit',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '样品编辑',
          activeMenu: '/erp/sample/index'
        }
      },
      {
        path: 'detail/:id(\\d+)', // 样品详情
        component: () => import('@/views/erp/sample/form/index.vue'),
        name: 'ErpSampleDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '样品详情',
          activeMenu: '/erp/sample/index'
        }
      }
    ]
  },



  {
    path: '/mall/product', // 商品中心
    component: Layout,
    name: 'ProductCenter',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'spu/add',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuAdd',
        meta: {
          noCache: false, // 需要缓存
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '商品添加',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'spu/edit/:id(\\d+)',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuEdit',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '商品编辑',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'spu/detail/:id(\\d+)',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '商品详情',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'property/value/:propertyId(\\d+)',
        component: () => import('@/views/mall/product/property/value/index.vue'),
        name: 'ProductPropertyValue',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '商品属性值',
          activeMenu: '/product/property'
        }
      }
    ]
  },
  {
    path: '/mall/trade', // 交易中心
    component: Layout,
    name: 'TradeCenter',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'order/detail/:id(\\d+)',
        component: () => import('@/views/mall/trade/order/detail/index.vue'),
        name: 'TradeOrderDetail',
        meta: { title: '订单详情', icon: 'ep:view', activeMenu: '/mall/trade/order' }
      },
      {
        path: 'after-sale/detail/:id(\\d+)',
        component: () => import('@/views/mall/trade/afterSale/detail/index.vue'),
        name: 'TradeAfterSaleDetail',
        meta: { title: '退款详情', icon: 'ep:view', activeMenu: '/mall/trade/after-sale' }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    name: 'MemberCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'user/detail/:id',
        name: 'MemberUserDetail',
        meta: {
          title: '会员详情',
          noCache: true,
          hidden: true
        },
        component: () => import('@/views/member/user/detail/index.vue')
      }
    ]
  },
  {
    path: '/pay',
    component: Layout,
    name: 'pay',
    meta: { hidden: true },
    children: [
      {
        path: 'cashier',
        name: 'PayCashier',
        meta: {
          title: '收银台',
          noCache: true,
          hidden: true
        },
        component: () => import('@/views/pay/cashier/index.vue')
      }
    ]
  },
  {
    path: '/diy',
    name: 'DiyCenter',
    meta: { hidden: true },
    component: Layout,
    children: [
      {
        path: 'template/decorate/:id',
        name: 'DiyTemplateDecorate',
        meta: {
          title: '模板装修',
          noCache: true,
          hidden: true,
          activeMenu: '/mall/promotion/diy/template'
        },
        component: () => import('@/views/mall/promotion/diy/template/decorate.vue')
      },
      {
        path: 'page/decorate/:id',
        name: 'DiyPageDecorate',
        meta: {
          title: '页面装修',
          noCache: true,
          hidden: true,
          activeMenu: '/mall/promotion/diy/page'
        },
        component: () => import('@/views/mall/promotion/diy/page/decorate.vue')
      }
    ]
  },
  {
    path: '/crm',
    component: Layout,
    name: 'CrmCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'clue/detail/:id',
        name: 'CrmClueDetail',
        meta: {
          title: '线索详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/clue'
        },
        component: () => import('@/views/crm/clue/detail/index.vue')
      },
      {
        path: 'customer/detail/:id',
        name: 'CrmCustomerDetail',
        meta: {
          title: '客户详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/customer'
        },
        component: () => import('@/views/crm/customer/detail/index.vue')
      },
      {
        path: 'business/detail/:id',
        name: 'CrmBusinessDetail',
        meta: {
          title: '商机详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/business'
        },
        component: () => import('@/views/crm/business/detail/index.vue')
      },
      {
        path: 'contract/detail/:id',
        name: 'CrmContractDetail',
        meta: {
          title: '合同详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/contract'
        },
        component: () => import('@/views/crm/contract/detail/index.vue')
      },
      {
        path: 'receivable-plan/detail/:id',
        name: 'CrmReceivablePlanDetail',
        meta: {
          title: '回款计划详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/receivable-plan'
        },
        component: () => import('@/views/crm/receivable/plan/detail/index.vue')
      },
      {
        path: 'receivable/detail/:id',
        name: 'CrmReceivableDetail',
        meta: {
          title: '回款详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/receivable'
        },
        component: () => import('@/views/crm/receivable/detail/index.vue')
      },
      {
        path: 'contact/detail/:id',
        name: 'CrmContactDetail',
        meta: {
          title: '联系人详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/contact'
        },
        component: () => import('@/views/crm/contact/detail/index.vue')
      },
      {
        path: 'product/detail/:id',
        name: 'CrmProductDetail',
        meta: {
          title: '产品详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/product'
        },
        component: () => import('@/views/crm/product/detail/index.vue')
      }
    ]
  },
  {
    path: '/ai',
    component: Layout,
    name: 'Ai',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'image/square',
        component: () => import('@/views/ai/image/square/index.vue'),
        name: 'AiImageSquare',
        meta: {
          title: '绘图作品',
          icon: 'ep:home-filled',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/Error/404.vue'),
    name: '',
    meta: {
      title: '404',
      hidden: true,
      breadcrumb: false
    }
  },
  {
    path: '/iot',
    component: Layout,
    name: 'IOT',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'product/detail/:id',
        name: 'IoTProductDetail',
        meta: {
          title: '产品详情',
          noCache: true,
          hidden: true,
          activeMenu: '/iot/product'
        },
        component: () => import('@/views/iot/product/detail/index.vue')
      },
      {
        path: 'device/detail/:id',
        name: 'IoTDeviceDetail',
        meta: {
          title: '设备详情',
          noCache: true,
          hidden: true,
          activeMenu: '/iot/device'
        },
        component: () => import('@/views/iot/device/detail/index.vue')
      }
    ]
  }
]

export default remainingRouter
