import { isAdmin, isCustomer } from '../../app/router/secure-guard';
export default {
  header: {
    self: {},
    items: [
      {
        title: "Dashboards",
        root: true,
        alignment: "left",
        page: "dashboard",
        translate: "MENU.DASHBOARD"
      },
      // {
      //   //title: "Material UI",
      //   root: true,
      //   alignment: "left",
      //   toggle: "click",
      //   submenu: [
      // {
      //  // title: "Layout",
      //   bullet: "dot",
      //   submenu: [
      //     {
      //       title: "Box",
      //       bullet: "line",
      //       page: "google-material/layout/box"
      //     },
      //     {
      //       title: "Container",
      //       bullet: "line",
      //       page: "google-material/layout/container"
      //     },
      //     {
      //       title: "Grid",
      //       bullet: "line",
      //       page: "google-material/layout/grid"
      //     },
      //     {
      //       title: "Grid list",
      //       bullet: "line",
      //       page: "google-material/layout/grid-list"
      //     },
      //     {
      //       title: "Hidden",
      //       bullet: "line",
      //       page: "google-material/layout/hidden"
      //     }
      //   ]
      // },
      {
        title: "UserAccount",
        root: true,
        alignment: "left",
        page: "User",
        translate: "MENU.DASHBOARD"
      },
    ]
  },
  aside: {
    self: {},
    items: [
      {
        title: "Manage Customers",
        root: true,
        alignment: "left",
        page: "customer",
        icon: "flaticon2-architecture-and-city",
        guard: "isAdmin"
      },
      {
        title: "Manage Users",
        root: true,
        icon: "flaticon-users",
        page: "users",
        translate: "MENU.USERS",
        bullet: "dot",
        guard: "isAdmin"
      },
      {
        title: "Dashboard",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "dashboard",
        translate: "MENU.DASHBOARD",
        bullet: "dot",
        guard: "isCustomer"
      },
      {
        title: "Onboarding",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "onboarding",
        bullet: "dot",
        guard: "isCustomer"
      },
      // { section: "Custom" },
      // // {
      // //   root: true,
      // //   title: "Documentation",
      // //   bullet: "dot",
      // //   icon: "flaticon2-file-1",
      // //   submenu: [
      // //     { title: "Quick Start", page: "docs/quick-start" },
      // //     { title: "Overview", page: "docs/overview" },
      // //     { title: "Deployment", page: "docs/deployment" },
      // //     { title: "Internationalization", page: "docs/i18n" },
      // //     { title: "Mock Backend", page: "docs/mock-backend" },
      // //     { title: "Create a Page", page: "docs/create-a-page" }
      // //   ]
      // // },

    ]
  }
};
