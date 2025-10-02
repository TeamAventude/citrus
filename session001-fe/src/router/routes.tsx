import * as routes from "../constants/routes";

const routeItems = [
  {
    path: routes.DASHBOARD,
    component: "Dashboard",
    policy: "dashboard.index",
  },
];

export default routeItems;
