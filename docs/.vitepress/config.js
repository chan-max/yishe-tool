export default {
  // site-level options
  title: "衣设网",
  description: "Just playing around.",
  themeConfig: {
    siteTitle: "衣设网",
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "GuideTest", link: "/guide/test" },
      { text: "gitee", link: "" },
      {
        text: "Drop Menu",
        items: [
          {
            items: [
              { text: "Item A1", link: "/item-A1" },
              { text: "Item A2", link: "/item-A2" },
            ],
          },
          {
            items: [
              { text: "Item B1", link: "/item-B1" },
              { text: "Item B2", link: "/item-B2" },
            ],
          },
        ],
      },
    ],
    sidebar: [
      {
        text: "项目介绍",
        items: [
          {
            text: "组件库环境搭建",
            link: "/articles/组件库环境搭建",
          },
          { text: "gulp的使用", link: "/articles/gulp的使用" },
        ],
      },
      {
        text: "开发文档",
        items: [
          {
            text: "接口",
            link:'/api/commonApi.md'
          },
        ],
      },
    ],
  },
};
