import { Clock3Icon } from "lucide-react"
import { Input } from "~/components/ui/input"

interface TimeFieldProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  step?: number
  "aria-invalid"?: boolean
}

export function TimeField({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  step = 60,
  "aria-invalid": ariaInvalid,
}: TimeFieldProps) {
  return (
    <div className="relative">
      <Clock3Icon className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        type="time"
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        step={step}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden"
      />
    </div>
  )
}
