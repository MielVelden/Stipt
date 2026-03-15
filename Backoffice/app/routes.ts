import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),

  layout("dashboard/dashboard.layout.tsx", prefix("app", [
    ...prefix("events", [
      route("events", "dashboard/events/events.overview.tsx")
    ]),
  ])),
] satisfies RouteConfig
