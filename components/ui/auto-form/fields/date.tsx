import { useEffect, useRef } from "react";
import { DatePicker } from "../../date-picker";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../form";
import { Input } from "../../input";
import { AutoFormInputComponentProps } from "../types";
import { Button } from "react-day-picker";
import { DateTimePicker } from "../../dateTimePicker/date-time-picker";

export default function AutoFormDate({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {

  const ref = useRef<HTMLInputElement>(null);
  return (
    <FormItem>
      <FormLabel>
        {label}
        {isRequired && <span className="text-destructive"> *</span>}
      </FormLabel>
      <FormControl>
        {/* <DatePicker
          date={field.value}
          setDate={field.onChange}
          {...fieldProps}
        /> */}
        <Input
        onClick={(e) => console.log(e.target instanceof HTMLInputElement && e.target.value)}
          type="date"
          value={field.value}
          defaultValue={field.value}
          onChange={field.onChange}
          {...fieldProps}
        />
        {/* <DateTimePicker 
          value={field.value}
          onChange={field.onChange}
          {...fieldProps}
        /> */}
      </FormControl>
      {fieldConfigItem.description && (
        <FormDescription>{fieldConfigItem.description}</FormDescription>
      )}

      <FormMessage />
    </FormItem>
  );
}
