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
import { isoToLocalDate } from "@/lib/dateUtils";

export default function AutoFormDate({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  field.value =
    fieldProps.value instanceof Date
      ? isoToLocalDate(fieldProps.value)
      : undefined;
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
          onClick={(e) => {
            console.log("fieldConfigItem", fieldConfigItem);
            console.log("field", field);
            console.log("fieldProps", fieldProps);
          }}
          {...fieldConfigItem}
          {...fieldConfigItem.inputProps}
          value={field.value}
          onChangeCapture={field.onChange}
          type="datetime-local"
          onChange={field.onChange}
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
