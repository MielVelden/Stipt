import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parseISO, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDateTime(date: string | Date | null | undefined): string {
    if (!date) return "Geen datum";

    const d = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(d)) return "Ongeldige datum";

    return format(d, "d MMM yyyy ' | ' HH:mm", { locale: nl });
}

export function formatDateTimeRange(
    start: string | Date | null | undefined,
    end: string | Date | null | undefined,
): string {
    if (!start || !end) return "Geen datum";

    const startDate = typeof start === "string" ? parseISO(start) : start;
    const endDate = typeof end === "string" ? parseISO(end) : end;

    if (!isValid(startDate) || !isValid(endDate)) return "Ongeldige datum";

    if (isSameDay(startDate, endDate)) {
        const times = `${format(startDate, "HH:mm")} - ${format(endDate, "HH:mm")}`;
        const date = format(startDate, "d MMM", { locale: nl });
        return `${date} ${times}`;
    }

    const startTime = format(startDate, "d MMM HH:mm", { locale: nl });
    const endTime = format(endDate, "d MMM HH:mm", { locale: nl });

    return `${startTime} - ${endTime}`;
}

export function formatTime(date: string | Date | null | undefined): string {
    if (!date) return "";

    const d = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(d)) return "";

    return format(d, "HH:mm", { locale: nl });
}
