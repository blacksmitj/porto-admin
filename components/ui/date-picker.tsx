"use client";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";
import { format, getYear } from "date-fns";

interface DatePickerProps {
  value: Date | undefined;
  onChange: () => void;
  disable: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disable,
}) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          disabled={disable}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          disabled={disable}
          mode="single"
          captionLayout="dropdown-buttons"
          selected={value}
          onSelect={onChange}
          fromYear={1980}
          toYear={getYear(new Date())}
          defaultMonth={value}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
