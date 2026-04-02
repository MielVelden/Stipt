type AuthFailureListener = () => void | Promise<void>;

let authFailureListenerAsync: AuthFailureListener | null = null;

export function setAuthFailureListener(listener: AuthFailureListener): void {
  authFailureListenerAsync = listener;
}

export async function notifyAuthFailureAsync(): Promise<void> {
  if (authFailureListenerAsync)
    await authFailureListenerAsync();
}
