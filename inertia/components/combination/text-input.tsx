import type { ReactNode } from 'react'
import { FormField } from '@/components/ui/form_field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password_input'
import { Textarea } from '@/components/ui/textarea'

interface TextInputBaseProps {
  label: string
  name: string
  value?: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  required?: boolean
  description?: ReactNode
  placeholder?: string
  className?: string
}

interface TextInputAsInput extends TextInputBaseProps {
  rows?: never
  type?: 'text' | 'number' | 'url' | 'file' | 'email' | 'password'
  min?: number
  max?: number
  step?: number
  accept?: string
}

interface TextInputAsTextarea extends TextInputBaseProps {
  rows: number
  type?: never
  min?: never
  max?: never
  step?: never
  accept?: never
}

export type TextInputProps = TextInputAsInput | TextInputAsTextarea

export function TextInput({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  description,
  placeholder,
  className,
  rows,
  type = 'text',
  min,
  max,
  step,
  accept,
  ...rest
}: TextInputProps & Omit<React.ComponentProps<'input'>, keyof TextInputBaseProps>) {
  const id = name

  if (rows != null && rows > 0) {
    return (
      <FormField
        label={label}
        htmlFor={id}
        required={required}
        description={description}
        error={error}
        className={className}>
        <Textarea
          id={id}
          name={name}
          value={value === '' ? '' : String(value)}
          onChange={onChange as React.ChangeEvent<HTMLTextAreaElement>}
          placeholder={placeholder}
          rows={rows}
          {...rest}
        />
      </FormField>
    )
  }

  const isFile = type === 'file'
  const isPassword = type === 'password'

  if (isPassword) {
    return (
      <FormField
        label={label}
        htmlFor={id}
        required={required}
        description={description}
        error={error}
        className={className}>
        <PasswordInput
          id={id}
          name={name}
          value={value === '' ? '' : value}
          onChange={onChange as React.ChangeEvent<HTMLInputElement>}
          placeholder={placeholder}
          required={required}
          {...rest}
        />
      </FormField>
    )
  }

  return (
    <FormField
      label={label}
      htmlFor={id}
      required={required}
      description={description}
      error={error}
      className={className}>
      <Input
        id={id}
        name={name}
        type={type}
        {...(isFile ? {} : { value: value === '' ? '' : value })}
        onChange={onChange as React.ChangeEvent<HTMLInputElement>}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        accept={accept}
        required={required}
        {...rest}
      />
    </FormField>
  )
}
