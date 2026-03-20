import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  return Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString))
}

export function formatTime(dateString: string) {
  return Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))
}

export function formatDateRange(startDateTime: string, endDateTime: string) {
  const date = formatDate(startDateTime)
  const startTime = formatTime(startDateTime)
  const endTime = formatTime(endDateTime)

  return `${date}, ${startTime} - ${endTime}`
}