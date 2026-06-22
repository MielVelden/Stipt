import { createContext, ReactNode, useContext } from "react";
import { ConnectToHub, ConnectionStatus } from "@/lib/signalr-client";
import * as signalR from "@microsoft/signalr";

interface SessionHubContextValue {
    connection: signalR.HubConnection | null;
    status: ConnectionStatus;
}

const SessionHubContext = createContext<SessionHubContextValue | null>(null);

export function SessionHubProvider({ children }: { children: ReactNode }) {
    const { connection, status } = ConnectToHub("/hub/sessions");

    return (
        <SessionHubContext.Provider value={{ connection, status }}>
            {children}
        </SessionHubContext.Provider>
    );
}

export function useSessionHubConnection(): SessionHubContextValue {
    const ctx = useContext(SessionHubContext);
    if (!ctx)
        throw new Error("useSessionHubConnection must be used inside SessionHubProvider");
    
    return ctx;
}
