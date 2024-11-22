import React, { useState } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
}

interface DateEvents {
  [key: string]: CalendarEvent[];
}

const formatDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const isDateInRange = (date: Date): boolean => {
  const minDate = new Date("1970-01-01");
  const maxDate = new Date("2200-01-01");
  return date >= minDate && date <= maxDate;
};

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<DateEvents>({});
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const todayDate = formatDateKey(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    if (isDateInRange(newDate)) {
      setCurrentDate(newDate);
    } else {
      alert("Calendar supports dates from 1970 to 2200");
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    if (isDateInRange(newDate)) {
      setCurrentDate(newDate);
    } else {
      alert("Calendar supports dates from 1970 to 2200");
    }
  };

  const handleAddEvent = () => {
    if (newEventTitle.trim()) {
      const dateKey = selectedDate;
      const currentEvents = events[dateKey] || [];

      if (currentEvents.length >= 3) {
        alert("You can only add up to 3 events per date");
        return;
      }

      const newEvent: CalendarEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: newEventTitle,
        date: new Date(selectedDate),
      };

      setEvents((prev) => ({
        ...prev,
        [dateKey]: [...currentEvents, newEvent],
      }));
      setNewEventTitle("");
      setIsAddEventOpen(false);
    }
  };

  const handleSelectDate = (date: number) => {
    const selectedKey = formatDateKey(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
    );
    setSelectedDate(selectedKey);
  };

  const getEventsForDate = (date: number): CalendarEvent[] => {
    const dateKey = formatDateKey(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
    );
    return events[dateKey] || [];
  };

  const isToday = (date: number): boolean => {
    return formatDateKey(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
    ) === todayDate;
  };

  const isSelectedDate = (date: number): boolean => {
    return formatDateKey(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
    ) === selectedDate;
  };

  return (
    <div className="max-w-4xl  mt-[230px] rounded-md mx-auto bg-[#222] shadow-lg  shadow-neutral-700 p-9  font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-stone-50">{monthYear}</h2>
        <div className="space-x-2 tepabatn">
          <button
            onClick={handlePreviousMonth}
            className="px-8  bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            &lt;
          </button>
          <button
            onClick={handleNextMonth}
            className="px-8  bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day} className="text-white text-center font-bold">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = index + 1;
          const dateEvents = getEventsForDate(date);

          return (
            <div
              key={date}
              onClick={() => handleSelectDate(date)}
              className={` flex items-center cursor-pointer bg-neutral-700 text-white shadow-md shadow-neutral-600  w-28 p-2  rounded-full ${
                isSelectedDate(date)
                  ? "bg-[#2222] cursor-pointer text-neutral-950 "
                  : isToday(date)
                  ? "bg-blue-900 shadow-md shadow-blue-900 text-black"
                  : ""
              }`}
            >
              <div className="font-bold">{date}</div>
              <div className="space-y-1">
                {dateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-[12px] border-b  px-1 py-[0.5]"
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setIsAddEventOpen(true)}
        className="mt-6 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-600"
      >
        Add Event
      </button>

      {isAddEventOpen && (
        <div className="fixed inset-0 text-white  flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#222] shadow-xl  rounded-md p-6 w-[500px] bg-blur">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="new event"
                className="text-black font-semibold outline-none  w-full p-2 border rounded-md mt-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min="1970-01-01"
                max="2200-01-01"
                className="text-black font-semibold outline-none w-full p-2 border rounded-md mt-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="px-4 py-2 bg-blue-900  border-gray-300 rounded-md hover:bg-blue-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
      <a href="https://www.instagram.com/199.nzm/" className="text-blue-700 absolute mt-60 ml-64 font-semibold" >By/199.nzm</a>
    </div>
  );
};

export default App;
