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
      route("", "routes/dashboard/dashboard.overview.tsx"),

      ...prefix("evenementen", [
        route("", "routes/events/events.overview.tsx"),
        route("nieuw", "routes/events/events.create.tsx"),
        route(":id", "routes/events/events.details.tsx"),
        route(":id/bewerken", "routes/events/events.edit.tsx"),
      ]),

      ...prefix("sessies", [
        route("", "routes/sessions/sessions.overview.tsx"),
        route(":id", "routes/sessions/sessions.details.tsx"),
        route(":id/bewerken", "routes/sessions/sessions.edit.tsx"),
        route("nieuw", "routes/sessions/sessions.create.tsx"),
      ]),

      ...prefix("ruimtes", [
        route("", "routes/rooms/rooms.overview.tsx"),
        route("nieuw", "routes/rooms/rooms.new.tsx"),
        route(":id/bewerken", "routes/rooms/rooms.edit.tsx"),
      ]),
    ])
  ),
] satisfies RouteConfig
