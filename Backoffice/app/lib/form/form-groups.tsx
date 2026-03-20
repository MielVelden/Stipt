import { useState } from "react"
import { Controller } from "react-hook-form"
import type { Control, UseFormSetValue, UseFormWatch } from "react-hook-form"
import type { ReactNode } from "react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { DatePicker } from "~/components/ui/date-picker"
import { ColorPicker } from "~/components/ui/color-picker"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { XIcon } from "lucide-react"
import type { FieldConfig, FieldGroupConfig } from "./field-config"

// --- Readonly ---

function ReadonlyField<TEntity>({
  config,
  entity,
}: {
  config: FieldConfig<any, TEntity>
  entity: TEntity
}) {
  if (config.kind === "labels") {
    const labels = config.readonlyValue(entity) as string[]
    return (
      <Field className={config.className}>
        <FieldLabel>{config.label}</FieldLabel>
        <FieldContent className="flex flex-row flex-wrap gap-2">
          {labels.length === 0 ? (
            <span>-</span>
          ) : (
            labels.map((label) => (
              <Badge key={label} variant="secondary">
                {label}
              </Badge>
            ))
          )}
        </FieldContent>
      </Field>
    )
  }

  if (config.kind === "color") {
    const color = config.readonlyValue(entity) as string
    return (
      <Field className={config.className}>
        <FieldLabel>{config.label}</FieldLabel>
        <FieldContent className="flex items-center gap-2">
          <div
            className="h-5 w-5 rounded border"
            style={{ backgroundColor: color }}
          />
          {color}
        </FieldContent>
      </Field>
    )
  }

  return (
    <Field className={config.className}>
      <FieldLabel>{config.label}</FieldLabel>
      <FieldContent>{config.readonlyValue(entity) as ReactNode}</FieldContent>
    </Field>
  )
}

// --- Edit ---

function LabelsEditField({
  name,
  label,
  className,
  setValue,
  watch,
}: {
  name: string
  label: string
  className?: string
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
}) {
  const [newLabel, setNewLabel] = useState("")
  const currentLabels = (watch(name) as string[]) ?? []

  const addLabel = () => {
    const trimmed = newLabel.trim()
    if (trimmed && !currentLabels.includes(trimmed)) {
      setValue(name, [...currentLabels, trimmed], { shouldValidate: true })
      setNewLabel("")
    }
  }

  const removeLabel = (label: string) => {
    setValue(
      name,
      currentLabels.filter((l) => l !== label),
      { shouldValidate: true }
    )
  }

  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup className="mb-2 max-w-xs">
        <InputGroupInput
          placeholder="Typ een label..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addLabel()
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="link" type="button" onClick={addLabel}>
            Toevoegen
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldContent className="flex flex-row flex-wrap gap-2">
        {currentLabels.map((label) => (
          <Badge key={label} variant="secondary" className="py-1 pr-1 pl-2">
            {label}
            <Button
              onClick={() => removeLabel(label)}
              variant="ghost"
              size="icon"
              className="ml-1 h-4 w-4 cursor-pointer rounded-full"
              type="button"
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </FieldContent>
    </Field>
  )
}

function EditField({
  config,
  control,
  setValue,
  watch,
  selectOptions,
}: {
  config: FieldConfig<any, any>
  control: Control<any>
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  selectOptions?: Record<string, string[]>
}) {
  if (config.kind === "labels") {
    return (
      <LabelsEditField
        name={config.name}
        label={config.label}
        className={config.className}
        setValue={setValue}
        watch={watch}
      />
    )
  }

  return (
    <Controller
      name={config.name}
      control={control}
      render={({ field, fieldState }) => {
        let widget: ReactNode
        let description: ReactNode = null

        switch (config.kind) {
          case "text":
            widget = (
              <Input
                {...field}
                id={config.name}
                placeholder={config.placeholder}
                aria-invalid={fieldState.invalid}
              />
            )
            break
          case "textarea":
            widget = (
              <Textarea
                {...field}
                id={config.name}
                placeholder={config.placeholder}
                rows={config.rows}
                aria-invalid={fieldState.invalid}
              />
            )
            break
          case "number":
            widget = (
              <Input
                {...field}
                id={config.name}
                type="number"
                placeholder={config.placeholder}
                aria-invalid={fieldState.invalid}
              />
            )
            if (config.description) {
              description = (
                <FieldDescription className="text-xs">
                  {config.description}
                </FieldDescription>
              )
            }
            break
          case "date":
            widget = (
              <DatePicker
                id={config.name as string}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={field.disabled}
                aria-invalid={fieldState.invalid}
              />
            )
            break
          case "time":
            widget = (
              <Input
                {...field}
                id={config.name as string}
                type="time"
                aria-invalid={fieldState.invalid}
              />
            )
            break
          case "select": {
            const options = selectOptions?.[config.optionsKey] ?? []
            widget = (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id={config.name} aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder={config.placeholder} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )
            break
          }
          case "color":
            widget = (
              <ColorPicker
                id={config.name as string}
                value={field.value || "#000000"}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={field.disabled}
                aria-invalid={fieldState.invalid}
              />
            )
            break
        }

        return (
          <Field className={config.className} data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={config.name}>{config.label}</FieldLabel>
            {widget}
            {description}
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}

// --- Public API ---

type FormGroupsReadonlyProps<TEntity> = {
  mode: "readonly"
  entity: TEntity
  fieldGroups: FieldGroupConfig<any, TEntity>[]
}

type FormGroupsEditProps = {
  mode: "edit"
  fieldGroups: FieldGroupConfig<any, any>[]
  control: Control<any>
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  /** Opties voor `kind: "select"` velden, geïndexeerd op `optionsKey` */
  selectOptions?: Record<string, string[]>
}

export type FormGroupsProps<TEntity> =
  | FormGroupsReadonlyProps<TEntity>
  | FormGroupsEditProps

export function FormGroups<TEntity>(props: FormGroupsProps<TEntity>) {
  const { fieldGroups } = props

  return (
    <>
      {fieldGroups.map((group, groupIndex) => {
        if (group.length === 1) {
          const config = group[0]
          if (props.mode === "readonly") {
            return (
              <ReadonlyField key={groupIndex} config={config} entity={props.entity} />
            )
          }
          return (
            <EditField
              key={groupIndex}
              config={config}
              control={props.control}
              setValue={props.setValue}
              watch={props.watch}
              selectOptions={props.selectOptions}
            />
          )
        }

        return (
          <FieldGroup key={groupIndex} className="flex flex-row gap-4">
            {group.map((config) => {
              if (props.mode === "readonly") {
                return (
                  <ReadonlyField
                    key={config.name}
                    config={config}
                    entity={props.entity}
                  />
                )
              }
              return (
                <EditField
                  key={config.name}
                  config={config}
                  control={props.control}
                  setValue={props.setValue}
                  watch={props.watch}
                  selectOptions={props.selectOptions}
                />
              )
            })}
          </FieldGroup>
        )
      })}
    </>
  )
}
