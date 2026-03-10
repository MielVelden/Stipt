import type { EnvironmentSetting } from "~/types/api";

export const environmentSettings: EnvironmentSetting[] = [
  {
    id: "api-base-url",
    label: "API base URL",
    value: "https://api.example.com",
    note: "Point the front-end at the correct REST environment.",
  },
  {
    id: "api-version",
    label: "API version",
    value: "v1",
    note: "Track the backend contract the UI is currently built against.",
  },
  {
    id: "request-timeout",
    label: "Request timeout",
    value: "15000",
    note: "Milliseconds before the client surfaces a timeout error.",
  },
];
