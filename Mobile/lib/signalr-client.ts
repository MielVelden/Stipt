import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { API_BASE_URL } from "@/constants/api";
import { getAccessTokenAsync, refreshAccessTokenAsync } from "@/lib/auth";

export type ConnectionStatus =
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting";

export function ConnectToHub(path: string) {
    const [connection, setConnection] =
        useState<signalR.HubConnection | null>(null);
    const [status, setStatus] = useState<ConnectionStatus>("disconnected");

    useEffect(() => {
        const hubUrl = `${API_BASE_URL}${path}`;
        const options: signalR.IHttpConnectionOptions = {};

        let token: string | null;

        const refreshAccessToken = async () => {
            await refreshAccessTokenAsync()
            token = await getAccessTokenAsync()
        }

        options.accessTokenFactory = async () => {
            token = await getAccessTokenAsync() || ""
            return token;
        };

        const nextConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: async () => (await getAccessTokenAsync()) || "",
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        nextConnection.onreconnecting(async () => {
            setStatus("reconnecting");
            await refreshAccessToken();
        });
        nextConnection.onreconnected(() => setStatus("connected"));
        nextConnection.onclose(() => setStatus("disconnected"));

        setConnection(nextConnection);
        setStatus("connecting");

        nextConnection
            .start()
            .then(() => setStatus("connected"))
            .catch((err) => {
                console.error("SignalR start error:", err);
                setStatus("disconnected");
            });

        return () => {
            nextConnection.stop().catch(console.error);
        };
    }, [path]);

    return { connection, status };
}
