import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),
  route("login", "routes/login.tsx"),
  route("invite", "routes/invite.tsx"),

  layout(
    "layouts/dashboard.layout.tsx",

    prefix("app", [
      route("", "routes/events/redirect-to-events.tsx"),

      ...prefix("evenementen", [
        route("", "routes/events/events.overview.tsx"),
        route("nieuw", "routes/events/events.create.tsx"),
        route(":id", "routes/events/events.details.tsx"),
        route(":id/bewerken", "routes/events/events.edit.tsx"),
      ]),

      // Event specific routes
      ...prefix("event/:eventId", [
        route("", "routes/sessions/redirect-to-sessions.tsx"),

        ...prefix("sessies", [
          route("", "routes/sessions/sessions.overview.tsx"),
          route("nieuw", "routes/sessions/sessions.create.tsx"),
          route(":id", "routes/sessions/sessions.details.tsx"),
          route(":id/bewerken", "routes/sessions/sessions.edit.tsx"),
        ]),

        ...prefix("deelnemers", [
          route("", "routes/participants/participants.overview.tsx"),
          route("nieuw", "routes/participants/participants.create.tsx"),
          route("uploaden", "routes/participants/participants.upload.tsx"),
        ]),

        ...prefix("ruimtes", [
          route("", "routes/rooms/rooms.overview.tsx"),
          route("nieuw", "routes/rooms/rooms.create.tsx"),
          route(":id", "routes/rooms/rooms.details.tsx"),
          route(":id/bewerken", "routes/rooms/rooms.edit.tsx"),
        ]),

        ...prefix("sprekers", [
          route("", "routes/speakers/speakers.overview.tsx"),
          route("nieuw", "routes/speakers/speakers.create.tsx"),
          route(":id", "routes/speakers/speakers.details.tsx"),
          route(":id/bewerken", "routes/speakers/speakers.edit.tsx"),
        ]),
      ]),
    ])
  ),
] satisfies RouteConfig
