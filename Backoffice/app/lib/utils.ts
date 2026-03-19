import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(startDateTime: string, endDateTime: string) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  }

  const date = new Date(`${startDateTime}`).toLocaleDateString(
    "nl-NL",
    dateOptions
  )
  const startTime = new Date(`${startDateTime}`).toLocaleTimeString(
    "nl-NL",
    timeOptions
  )
  const endTime = new Date(`${endDateTime}`).toLocaleTimeString(
    "nl-NL",
    timeOptions
  )

  return `${date}, ${startTime} - ${endTime}`
}