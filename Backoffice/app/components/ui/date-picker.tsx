import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { nl } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "~/components/ui/calendar"
import { Button } from "~/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { cn } from "~/lib/utils"

interface DatePickerProps {
  id?: string
  value?: string // YYYY-MM-DD
  onChange?: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  "aria-invalid"?: boolean
  minDate?: Date
  maxDate?: Date
  defaultMonth?: Date
}

export function DatePicker({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Kies een datum",
  disabled,
  "aria-invalid": ariaInvalid,
  minDate,
  maxDate,
  defaultMonth,
}: DatePickerProps) {
  const selected =
    value && value.length === 10
      ? parse(value, "yyyy-MM-dd", new Date())
      : undefined

  const displayValue =
    selected && isValid(selected)
      ? format(selected, "d MMMM yyyy", { locale: nl })
      : undefined

  const disabledDays = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          onBlur={onBlur}
          className={cn(
            "w-full justify-start text-left font-normal",
            !displayValue && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue ?? placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected && isValid(selected) ? selected : undefined}
          onSelect={(date) => {
            if (date) onChange?.(format(date, "yyyy-MM-dd"))
          }}
          disabled={disabledDays.length > 0 ? disabledDays : undefined}
          defaultMonth={
            (selected && isValid(selected) ? selected : undefined) ??
            defaultMonth ??
            minDate
          }
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
