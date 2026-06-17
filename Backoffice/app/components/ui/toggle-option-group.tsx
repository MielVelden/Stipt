import type { ReactNode } from "react"
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group"

export interface ToggleOption<T extends string> {
  value: T
  icon: ReactNode
  activeClassName?: string
}

interface ToggleOptionGroupProps<T extends string> {
  options: ToggleOption<T>[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
}

export function ToggleOptionGroup<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
}: ToggleOptionGroupProps<T>) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      variant="outline"
      value={value}
      onValueChange={(val) => {
        if (val) onChange(val as T)
      }}
      disabled={disabled}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className={option.activeClassName}
        >
          {option.icon}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
