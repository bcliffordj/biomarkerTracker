import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar"; // Adjust import path as needed
import { format } from 'date-fns';

function TestCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          console.log("Selected date in TestCalendar:", date);
          setSelectedDate(date);
        }}
        disabled={(date) => date > new Date()}
      />
      {selectedDate && <p>Selected Date: {format(selectedDate, 'PPP')}</p>}
    </div>
  );
}

export default TestCalendar;
