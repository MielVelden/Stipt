import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(date: string | Date | null | undefined): string {
    if (!date) return 'Geen datum';

    const d = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(d)) return 'Ongeldige datum';

    return format(d, "d MMM yyyy ' | ' HH:mm", { locale: nl });
}

export function formatTime(date: string | Date | null | undefined): string {
    if (!date) return '';

    const d = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(d)) return '';

    return format(d, 'HH:mm', { locale: nl });
}
