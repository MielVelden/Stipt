import * as SecureStore from "expo-secure-store";

const PENDING_INVITE_TOKEN_KEY = "pending_invite_token";

export async function setPendingInviteTokenAsync(token: string) {
    await SecureStore.setItemAsync(PENDING_INVITE_TOKEN_KEY, token);
}

export async function getPendingInviteTokenAsync(): Promise<string | null> {
    return await SecureStore.getItemAsync(PENDING_INVITE_TOKEN_KEY);
}

export async function clearPendingInviteTokenAsync() {
    await SecureStore.deleteItemAsync(PENDING_INVITE_TOKEN_KEY);
}
