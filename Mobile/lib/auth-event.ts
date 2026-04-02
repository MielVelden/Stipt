type AuthFailureListener = () => void;

let authFailureListener: AuthFailureListener | null = null;

export function setAuthFailureListener(listener: AuthFailureListener): void {
  authFailureListener = listener;
}

export function notifyAuthFailure(): void {
  if(authFailureListener)
    authFailureListener();
}
