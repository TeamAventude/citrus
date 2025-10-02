import * as routes from "../constants/routes";

const routeItems = [
  {
    path: routes.DASHBOARD,
    component: "Dashboard",
    policy: "dashboard.index",
  },
  {
    path: routes.TOOL_HISTORY,
    component: "SampleToolHistoryPage",
    policy: "tool-history.index",
  },
];

export default routeItems;
