import * as React from "react"
import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

interface ColorPickerProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  "aria-invalid"?: boolean
}

export function ColorPicker({
  id,
  value = "#000000",
  onChange,
  onBlur,
  disabled,
  "aria-invalid": ariaInvalid,
}: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value)

  useEffect(() => {
    setHexInput(value)
  }, [value])

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setHexInput(color)
    onChange?.(color)
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setHexInput(raw)
    if (/^#[0-9A-Fa-f]{6}$/.test(raw)) {
      onChange?.(raw)
    }
  }

  const handleHexBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput)) {
      setHexInput(value)
    }
  }

  return (
    <Popover onOpenChange={(open) => !open && onBlur?.()}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className="w-full justify-start gap-2 font-normal"
        >
          <div
            className="h-4 w-4 shrink-0 rounded border"
            style={{ backgroundColor: value }}
          />
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="flex flex-col gap-3">
          <input
            type="color"
            value={value}
            onChange={handleColorInput}
            className="h-32 w-full cursor-pointer rounded border-0 p-0"
          />
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 shrink-0 rounded border"
              style={{ backgroundColor: value }}
            />
            <Input
              value={hexInput}
              onChange={handleHexChange}
              onBlur={handleHexBlur}
              className="font-mono text-sm"
              maxLength={7}
              spellCheck={false}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
