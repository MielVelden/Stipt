import * as signalR from "@microsoft/signalr"
import { getToken } from "~/lib/auth"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5283/api"

export function createHubConnection(path: string): signalR.HubConnection {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${apiBaseUrl}${path}`, {
      accessTokenFactory: () => getToken() ?? "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build()
}
