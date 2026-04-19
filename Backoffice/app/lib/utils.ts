import { isAxiosError } from "axios"
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
  const localTimeMatch = dateString
    .trim()
    .match(/^\d{4}-\d{2}-\d{2}[ T](\d{2}):(\d{2})/)

  if (localTimeMatch) return `${localTimeMatch[1]}:${localTimeMatch[2]}`

  return Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))
}

export function formatDateRange(startDateTime: string, endDateTime: string) {
  const startDate = formatDate(startDateTime)
  const startTime = formatTime(startDateTime)
  const endDate = formatDate(endDateTime)
  const endTime = formatTime(endDateTime)

  if (startDate === endDate) {
    return `${startDate}, ${startTime} - ${endTime}`
  }
  return `${startDate}, ${startTime} - ${endDate}, ${endTime}`
}

export function getApiErrorDetail(error: unknown, fallbackMessage: string) {
  if (isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail ?? fallbackMessage
  }

  return fallbackMessage
}

export function splitIsoDateTime(isoDateTime: string) {
  const [date = "", time = ""] = isoDateTime.split("T")
  return {
    date,
    time: time.slice(0, 5),
  }
}
