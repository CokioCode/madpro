import Image from "next/image";
import type React from "react";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { DualRangeSlider } from "../ui/dual-range-slider";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export enum FormFieldType {
  INPUT = "input",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  RANGE_SLIDER = "rangeSlider",
  HIDDEN = "hidden",
  MULTISELECT = "multiselect",
  DATE_RANGE = "dateRange",
}

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  value?: string;
  maxLength?: number;

  min?: number;
  max?: number;
  step?: number;
  formatLabel?: (value: number | undefined) => string;

  options?: MultiSelectOption[];
  maxSelect?: number;
  startDate?: Date | null;
  endDate?: Date | null;
}

interface MultiSelectInputProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxSelect?: number;
}

const MultiSelectInput = ({
  options,
  value = [],
  onChange,
  placeholder = "Pilih opsi...",
  disabled = false,
  maxSelect,
}: MultiSelectInputProps) => {
  const [open, setOpen] = useState(false);

  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      if (maxSelect && value.length >= maxSelect) return;
      onChange([...value, val]);
    }
  };

  const selectedOptions = options.filter((o) => value.includes(o.value));

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          aria-disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!disabled) setOpen(!open);
            }
          }}
          tabIndex={disabled ? -1 : 0}
          className="shad-input w-full flex justify-between h-auto min-h-10 font-normal border border-dark-500 bg-dark-400 text-left rounded-md px-3 py-2 cursor-pointer"
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedOptions.map((item) => (
                <Badge
                  key={item.value}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  {item.label}
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onChange(value.filter((v) => v !== item.value));
                    }}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2 self-center" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 shad-select-content"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Cari..." />
          <CommandEmpty>Tidak ditemukan.</CommandEmpty>
          <ScrollArea className="h-60">
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              const isDisabled =
                !isSelected && !!maxSelect && value.length >= maxSelect;

              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  disabled={isDisabled}
                  onSelect={() => toggle(option.value)}
                  className={isDisabled ? "opacity-40 cursor-not-allowed" : ""}
                >
                  <div
                    className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </div>
                  {option.label}
                </CommandItem>
              );
            })}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

type RenderInputProps = {
  field: any;
  props: CustomProps;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
};

const RenderInput = ({ field, props, type }: RenderInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              type={type ?? "text"}
              maxLength={props.maxLength}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.DATE_RANGE: {
      const [start, end] = (field.value as [Date | null, Date | null]) ?? [
        null,
        null,
      ];

      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400 items-center px-3 gap-2 h-11">
          <FormControl>
            <ReactDatePicker
              selectsRange
              startDate={start}
              endDate={end}
              onChange={(dates: [Date | null, Date | null]) =>
                field.onChange(dates)
              }
              dateFormat="dd MMM yyyy"
              placeholderText={props.placeholder ?? "Pilih rentang tanggal"}
              wrapperClassName="flex-1"
              className="bg-transparent text-sm text-black w-full outline-none cursor-pointer placeholder:text-gray-500 caret-transparent"
              disabled={props.disabled}
            />
          </FormControl>

          {(start || end) && (
            <button
              type="button"
              onClick={() => field.onChange([null, null])}
              className="shrink-0 rounded-full p-1 hover:bg-dark-500 transition-colors"
            >
              <X className="h-3.5 w-3.5 text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
      );
    }
    case FormFieldType.PASSWORD:
      return (
        <div className="relative flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0 pr-10"
            />
          </FormControl>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <Image
              src={showPassword ? "/icons/eye-off.svg" : "/icons/eye.svg"}
              height={20}
              width={20}
              alt={showPassword ? "Hide password" : "Show password"}
            />
          </button>
        </div>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="user"
            className="ml-2"
          />
          <FormControl>
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value}
              onChange={(date: Date | null) => field.onChange(date)}
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={props.disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.RANGE_SLIDER:
      return (
        <FormControl>
          <div className="pt-6 pb-2">
            <DualRangeSlider
              value={field.value || [props.min || 0, props.max || 100]}
              onValueChange={field.onChange}
              min={props.min || 0}
              max={props.max || 100}
              step={props.step || 1}
              label={props.formatLabel}
              labelPosition="top"
              className="w-full"
            />
          </div>
        </FormControl>
      );

    case FormFieldType.HIDDEN:
      return (
        <FormControl>
          <Input type="hidden" {...field} value={props.value ?? field.value} />
        </FormControl>
      );

    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;

    // ─── MULTISELECT ────────────────────────────────────────────────────────
    case FormFieldType.MULTISELECT:
      return (
        <FormControl>
          <MultiSelectInput
            options={props.options ?? []}
            value={field.value ?? []}
            onChange={field.onChange}
            placeholder={props.placeholder}
            disabled={props.disabled}
            maxSelect={props.maxSelect}
          />
        </FormControl>
      );

    default:
      return null;
  }
};

// ─── CustomFormField ──────────────────────────────────────────────────────────
export const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX &&
            props.fieldType !== FormFieldType.HIDDEN &&
            label && (
              <FormLabel className="shad-input-label">{label}</FormLabel>
            )}
          <RenderInput field={field} type={props.type} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
