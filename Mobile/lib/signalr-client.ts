import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { API_BASE_URL } from "@/constants/api";

type ConnectionStatus =
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting";

export function useSignalR(path: string, token?: string) {
    const [connection, setConnection] =
        useState<signalR.HubConnection | null>(null);
    const [status, setStatus] = useState<ConnectionStatus>("disconnected");

    useEffect(() => {
        const hubUrl = `${API_BASE_URL}${path}`;
        const options: signalR.IHttpConnectionOptions = {};

        if (token) {
            options.accessTokenFactory = () => token;
        }

        const nextConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, options)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        setConnection(nextConnection);

        nextConnection.onreconnecting(() => setStatus("reconnecting"));
        nextConnection.onreconnected(() => setStatus("connected"));
        nextConnection.onclose(() => setStatus("disconnected"));

        const start = async () => {
            try {
                setStatus("connecting");
                await nextConnection.start();
                setStatus("connected");
            } catch (err) {
                console.error("SignalR start error:", err);
                setStatus("disconnected");
            }
        };

        start();

        return () => {
            nextConnection.stop().catch(console.error);
            setConnection(null);
        };
    }, [path, token]);

    return { connection, status };
}
