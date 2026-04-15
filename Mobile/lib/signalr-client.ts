import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { API_BASE_URL } from "@/constants/api";
import { getAccessTokenAsync, getRefreshTokenAsync, saveTokensAsync } from "@/lib/auth";
import { refreshTokensAsync } from "@/features/auth/api";

type ConnectionStatus =
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
            const refresToken = await getRefreshTokenAsync() || ""
            const response = await refreshTokensAsync(refresToken)
            await saveTokensAsync(response.accessToken, response.refreshToken)
            token = await getAccessTokenAsync()
        }

        options.accessTokenFactory = async () => {
            token = await getAccessTokenAsync() || ""
            return token;
        };

        const nextConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, options)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        setConnection(nextConnection);

        nextConnection.onreconnecting( async () => {
            setStatus("reconnecting")
            await refreshAccessToken()
        });
        nextConnection.onreconnected(() => setStatus("connected"));
        nextConnection.onclose( async () => {
            setStatus("disconnected")
        });

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
    }, [path]);

    return { connection, status };
}
