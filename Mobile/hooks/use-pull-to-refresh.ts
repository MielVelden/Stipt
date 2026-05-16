import { useState, useCallback, useRef, useEffect } from 'react';

export function usePullToRefresh(refreshFn: () => Promise<any>) {
    const minimumRefreshTime = 500;

    const [isRefreshing, setIsRefreshing] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                refreshFn(),
                new Promise((resolve) => setTimeout(resolve, minimumRefreshTime)),
            ]);
        } catch (error) {
            console.error("Pull to refresh error:", error);
        } finally {
            if (isMounted.current) {
                setIsRefreshing(false);
            }
        }
    }, [refreshFn]);

    return { isRefreshing, onRefresh };
}