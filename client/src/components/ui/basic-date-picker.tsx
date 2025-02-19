import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicDatePickerProps {
  selected: Date;
  onSelect: (date: Date | undefined) => void;
  startYear?: number;
  endYear?: number;
  className?: string;
}

export function BasicDatePicker({
  selected,
  onSelect,
  startYear = 2020,
  endYear = 2030,
  className,
}: BasicDatePickerProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const years = React.useMemo(() => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  }, [startYear, endYear]);

  const currentYear = selected ? selected.getFullYear() : new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(currentYear.toString());

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    if (selected) {
      const newDate = new Date(selected);
      newDate.setFullYear(parseInt(year));
      onSelect(newDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? format(selected, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onSelect(date);
              setCalendarOpen(false);
            }}
            disabled={(date) => {
              return date > new Date();
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
