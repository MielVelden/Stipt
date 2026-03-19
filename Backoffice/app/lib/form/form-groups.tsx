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
  if (config.kind === "tags") {
    const tags = config.readonlyValue(entity) as string[]
    return (
      <Field className={config.className}>
        <FieldLabel>{config.label}</FieldLabel>
        <FieldContent className="flex flex-row flex-wrap gap-2">
          {tags.length === 0 ? (
            <span>-</span>
          ) : (
            tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))
          )}
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

function TagsEditField({
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
  const [newTag, setNewTag] = useState("")
  const currentTags = (watch(name) as string[]) ?? []

  const addTag = () => {
    const trimmed = newTag.trim()
    if (trimmed && !currentTags.includes(trimmed)) {
      setValue(name, [...currentTags, trimmed], { shouldValidate: true })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setValue(
      name,
      currentTags.filter((t) => t !== tag),
      { shouldValidate: true }
    )
  }

  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup className="mb-2 max-w-xs">
        <InputGroupInput
          placeholder="Typ een tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addTag()
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="link" type="button" onClick={addTag}>
            Toevoegen
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldContent className="flex flex-row flex-wrap gap-2">
        {currentTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="py-1 pr-1 pl-2">
            {tag}
            <Button
              onClick={() => removeTag(tag)}
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
  if (config.kind === "tags") {
    return (
      <TagsEditField
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
              <Input
                {...field}
                id={config.name}
                type="date"
                aria-invalid={fieldState.invalid}
              />
            )
            break
          case "time":
            widget = (
              <Input
                {...field}
                id={config.name}
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
