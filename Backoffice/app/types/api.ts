export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface EndpointDefinition {
  id: string;
  name: string;
  method: HttpMethod;
  path: string;
  description: string;
}

export interface EnvironmentSetting {
  id: string;
  label: string;
  value: string;
  note: string;
}
