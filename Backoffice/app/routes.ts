import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes"

export default [
  index("routes/home/home.tsx"),

  layout(
    "layouts/dashboard.layout.tsx",
    prefix("app", [
      ...prefix("events", [
        route("", "routes/events/events.overview.tsx"),
        route(":id", "routes/events/events.details.tsx"),
      ]),
    ])
  ),
] satisfies RouteConfig
