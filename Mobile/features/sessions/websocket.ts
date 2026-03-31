import { useEffect, useState } from "react";
import { useSignalR } from "@/lib/signalr-client";

export function useSessionsHubMessages() {
    const { connection, status } = useSignalR("/sessionshub");
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        if (!connection) return;

        const onReceiveMessage = (message: string) => {
            setMessages((prev) => [...prev, `${message}`]);
        };

        connection.on("ReceiveMessage", onReceiveMessage);

        return () => {
            connection.off("ReceiveMessage", onReceiveMessage);
        };
    }, [connection]);

    const sendTestMessage = async () => {
        if (!connection) return;
        await connection.invoke("SendMessage", "hello from mobile");
    };

    return { messages, status, sendTestMessage };
}
