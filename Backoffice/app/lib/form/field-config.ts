export type TextFieldConfig = { kind: "text"; placeholder?: string }
export type TextareaFieldConfig = { kind: "textarea"; placeholder?: string; rows?: number }
export type NumberFieldConfig = { kind: "number"; placeholder?: string; description?: string }
export type DateFieldConfig = { kind: "date" }
export type TimeFieldConfig = { kind: "time" }
export type SelectFieldConfig = { kind: "select"; placeholder?: string; optionsKey: string }
export type TagsFieldConfig = { kind: "tags" }

export type FieldKindConfig =
  | TextFieldConfig
  | TextareaFieldConfig
  | NumberFieldConfig
  | DateFieldConfig
  | TimeFieldConfig
  | SelectFieldConfig
  | TagsFieldConfig

export type FieldConfig<
  TFormValues extends Record<string, any>,
  TEntity,
> = FieldKindConfig & {
  name: keyof TFormValues
  label: string
  className?: string
  readonlyValue: (entity: TEntity) => unknown
}

export type FieldGroupConfig<
  TFormValues extends Record<string, any>,
  TEntity,
> = FieldConfig<TFormValues, TEntity>[]
