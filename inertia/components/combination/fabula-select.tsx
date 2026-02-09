import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface FabulaSelectOption {
  value: string
  label: string
}

interface FabulaSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: FabulaSelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  size?: 'sm' | 'default'
  /** Optional custom label for the selected value (overrides options lookup) */
  selectedLabel?: string
}

export function FabulaSelect({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  className,
  triggerClassName,
  contentClassName,
  size = 'default',
  selectedLabel,
}: FabulaSelectProps) {
  const displayLabel = selectedLabel ?? options.find((o) => o.value === value)?.label

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger size={size} className={cn(className, triggerClassName)}>
        <SelectValue>{displayLabel ?? placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent className={cn(contentClassName)}>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
