import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/app-layout.tsx", [
    index("routes/dashboard.tsx"),
    route("requests", "routes/requests.tsx"),
    route("settings", "routes/settings.tsx"),
  ]),
] satisfies RouteConfig;
