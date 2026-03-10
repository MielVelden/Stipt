import type { EndpointDefinition } from "~/types/api";

export const dashboardStats = [
  {
    id: "uptime",
    label: "API uptime",
    value: "99.98%",
    copy: "Surface service availability next to operator tools.",
  },
  {
    id: "latency",
    label: "P95 latency",
    value: "184 ms",
    copy: "Keep the first line of operational data in the front-end.",
  },
  {
    id: "errors",
    label: "Open incidents",
    value: "3",
    copy: "Reserve this space for high-signal API failures.",
  },
];

export const requestTemplates: EndpointDefinition[] = [
  {
    id: "customers-list",
    name: "List customers",
    method: "GET",
    path: "/customers?limit=25",
    description: "Paginated collection request for a typical backoffice grid.",
  },
  {
    id: "customer-update",
    name: "Update customer",
    method: "PATCH",
    path: "/customers/:id",
    description: "Partial mutation endpoint for edit forms and moderation flows.",
  },
  {
    id: "export-orders",
    name: "Export orders",
    method: "POST",
    path: "/orders/export",
    description: "Long-running action endpoint with async job status tracking.",
  },
];
